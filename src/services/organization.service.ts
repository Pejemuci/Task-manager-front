import api from './api';
import {
  OrganizationWithMembers,
  User,
  InviteMemberData,
  InviteMemberResponse,
  UpdateOrganizationData,
  ApiResponse
} from '../types';

export const organizationService = {
  async getOrganization(): Promise<OrganizationWithMembers> {
    const { data } = await api.get<ApiResponse<OrganizationWithMembers>>('/organization');
    if (data.data) {
      return data.data;
    }
    throw new Error('Error al obtener organización');
  },

  async updateOrganization(data: UpdateOrganizationData): Promise<OrganizationWithMembers> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const organizationId = user.organizationId;
    const { data: response } = await api.patch<ApiResponse<OrganizationWithMembers>>(
      `/organization/${organizationId}`,
      data
    );
    return response.data!;
  },

  async getMembers(): Promise<User[]> {
    const { data } = await api.get<ApiResponse<User[]>>('/organization/members');
    return data.data || [];
  },

  async inviteMember(memberData: InviteMemberData): Promise<InviteMemberResponse> {
    const { data } = await api.post<ApiResponse<InviteMemberResponse>>(
      '/organization/members',
      memberData
    );
    if (data.data) {
      return data.data;
    }
    throw new Error('Error al invitar miembro');
  },

  async removeMember(memberId: string): Promise<void> {
    await api.delete(`/organization/members/${memberId}`);
  },
};
