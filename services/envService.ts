import axiosInstance from '@/configs/axiosInstance';
import { EnvItem } from '@/stores/envStore';
import { TApiResponse } from '@/types';

type EnvResponse = {
  envs: EnvItem[];
};
const get = async (data: { projectId: string }): Promise<TApiResponse<EnvResponse>> => {
  const result = await axiosInstance.get('/env', { params: data });

  return result.data;
};

export const envService = {
  get,
};
