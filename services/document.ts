import axiosInstance from '@/configs/axiosInstance';
import { TDocumentUids } from '@/stores/documents';
import { TApiResponse } from '@/types';

const getAllPageNames = async (
  projectId: string,
  branch: string
): Promise<TApiResponse<TDocumentUids[]>> => {
  const result = await (
    await axiosInstance.get('/documents/uids', { params: { projectId, branch } })
  ).data;

  return result;
};

export const documentService = {
  getAllPageNames,
};
