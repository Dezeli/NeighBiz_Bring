from rest_framework import serializers
from .models import Store

class StoreSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = [
            "name", "phone", "address", "category",
            "description", "image_url", "business_hours"
        ]

    def validate_business_hours(self, value):
        """
        요일별 영업시간 유효성 검사
        """
        import re

        valid_days = {"mon", "tue", "wed", "thu", "fri", "sat", "sun"}
        time_pattern = re.compile(r"^\d{2}:\d{2}$")

        for day, schedule in value.items():
            if day not in valid_days:
                raise serializers.ValidationError(f"{day}는 유효한 요일이 아닙니다.")

            if schedule.get("closed"):
                if any(k in schedule for k in ["open", "close", "break"]):
                    raise serializers.ValidationError(f"{day}: 'closed'가 true이면 다른 항목이 없어야 합니다.")
                continue

            if not schedule.get("open") or not schedule.get("close"):
                raise serializers.ValidationError(f"{day}: open/close 시간이 필요합니다.")

            for field in ["open", "close"]:
                if not time_pattern.match(schedule[field]):
                    raise serializers.ValidationError(f"{day}: {field}는 HH:MM 형식이어야 합니다.")

            if "break" in schedule:
                if not isinstance(schedule["break"], list) or len(schedule["break"]) != 2:
                    raise serializers.ValidationError(f"{day}: break는 [시작, 종료] 형식의 리스트여야 합니다.")
                for b in schedule["break"]:
                    if not time_pattern.match(b):
                        raise serializers.ValidationError(f"{day}: break 시간은 HH:MM 형식이어야 합니다.")

        return value
