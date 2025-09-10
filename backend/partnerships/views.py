from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from common.response import success, failure
from partnerships.serializers import *



class ProposalCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ProposalCreateSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            proposal = serializer.save()
            return Response(success(data={"proposal_id": proposal.id}, message="제휴 요청 전송에 성공했습니다."))
        return Response(failure(message="제휴 요청 전송에 실패했습니다.", data=serializer.errors))


class ProposalCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ProposalCancelSerializer(data=request.data, context={"request": request})
        if not serializer.is_valid():
            return Response(failure(message="제휴 제안 취소에 실패했습니다.", data=serializer.errors), status=400)

        proposal = serializer.validated_data["proposal"]
        proposal.status = ProposalStatus.CANCELLED.value
        proposal.save()

        return Response(success(message="제휴 제안이 취소되었습니다."))


class ProposalActionView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, pk):
        try:
            proposal = Proposal.objects.get(pk=pk)
        except Proposal.DoesNotExist:
            return Response(failure("해당 제안이 존재하지 않습니다."), status=404)

        serializer = ProposalActionSerializer(data=request.data, context={"proposal": proposal})

        if not serializer.is_valid():
            return Response(failure("유효하지 않은 선택입니다.", serializer.errors), status=400)

        try:
            message = serializer.perform_action()
        except serializers.ValidationError as e:
            error_detail = e.detail
            if isinstance(error_detail, list):
                error_message = error_detail[0]
            elif isinstance(error_detail, dict):
                error_message = next(iter(error_detail.values()))[0]
            else:
                error_message = str(error_detail)
            
            return Response(failure(message=error_message), status=400)

        return Response(success(message=message))
