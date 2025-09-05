from enum import Enum

class StoreCategory(str, Enum):
    CAFE       = "cafe"        # 카페
    RESTAURANT = "restaurant"  # 음식점
    BAKERY     = "bakery"      # 베이커리
    PUB        = "pub"         # 주점
    FITNESS    = "fitness"     # 운동
    STUDY      = "study"       # 독서실
    FLORIST    = "florist"     # 꽃집
    CONVENIENCE= "convenience" # 편의점
    ENTERTAIN  = "entertain"   # 유흥시설
    OTHER      = "other"       # 기타

    @classmethod
    def choices(cls):
        return [
            (cls.CAFE.value,        "카페"),
            (cls.RESTAURANT.value,  "음식점"),
            (cls.BAKERY.value,      "베이커리"),
            (cls.PUB.value,         "주점"),
            (cls.FITNESS.value,     "운동"),
            (cls.STUDY.value,       "독서실"),
            (cls.FLORIST.value,     "꽃집"),
            (cls.CONVENIENCE.value, "편의점"),
            (cls.ENTERTAIN.value,   "유흥시설"),
            (cls.OTHER.value,       "기타"),
        ]


class PartnershipDuration(str, Enum):
    ONE_MONTH = "1_month"
    TWO_MONTHS = "2_months"
    THREE_MONTHS = "3_months"
    SIX_MONTHS = "6_months"
    ONE_YEAR = "1_year"

    @classmethod
    def choices(cls):
        return [
            (cls.ONE_MONTH.value, "1개월"),
            (cls.TWO_MONTHS.value, "2개월"),
            (cls.THREE_MONTHS.value, "3개월"),
            (cls.SIX_MONTHS.value, "6개월"),
            (cls.ONE_YEAR.value, "1년"),
        ]


class CouponStatus(str, Enum):
    ACTIVE = "active"
    USED = "used"
    EXPIRED = "expired"

    @classmethod
    def choices(cls):
        return [
            (cls.ACTIVE.value, "사용 전"),
            (cls.USED.value, "사용 완료"),
            (cls.EXPIRED.value, "만료됨"),
        ]


class ProposalStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

    @classmethod
    def choices(cls):
        return [
            (cls.PENDING.value, "검토 중"),
            (cls.ACCEPTED.value, "승낙됨"),
            (cls.REJECTED.value, "거절됨"),
        ]


class PartnershipStatus(str, Enum):
    ACTIVE = "active"
    EXTENDED = "extended"
    TERMINATED = "terminated"
    ENDED = "ended"

    @classmethod
    def choices(cls):
        return [
            (cls.ACTIVE.value, "제휴 중"),
            (cls.EXTENDED.value, "연장 제휴"),
            (cls.TERMINATED.value, "중도 종료"),
            (cls.ENDED.value, "종료"),
        ]



class PartnershipChangeType(str, Enum):
    EXTEND = "extend"
    TERMINATE = "terminate"

    @classmethod
    def choices(cls):
        return [
            (cls.EXTEND.value, "연장 요청"),
            (cls.TERMINATE.value, "중도 종료 요청"),
        ]
