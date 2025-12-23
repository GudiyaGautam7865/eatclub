import apiClient from './apiClient.js';

export async function getAdminProfile() {
  try {
    const response = await apiClient('/admin/profile/me', { method: 'GET' });
    return response?.data || response;
  } catch (error) {
    console.error('Failed to fetch admin profile:', error);
    throw error;
  }
}

export async function updateAdminProfile(profileData) {
  try {
    const response = await apiClient('/admin/profile/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response?.data || response;
  } catch (error) {
    console.error('Failed to update admin profile:', error);
    throw error;
  }
}

export async function requestEmailChange(newEmail) {
  try {
    const response = await apiClient('/admin/profile/request-email-change', {
      method: 'POST',
      body: JSON.stringify({ newEmail }),
    });
    return response;
  } catch (error) {
    console.error('Failed to request email change:', error);
    throw error;
  }
}

export async function confirmEmailChange(code) {
  try {
    const response = await apiClient('/admin/profile/confirm-email-change', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
    return response?.data || response;
  } catch (error) {
    console.error('Failed to confirm email change:', error);
    throw error;
  }
}

export async function changePassword(currentPassword, newPassword) {
  try {
    const response = await apiClient('/admin/profile/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return response;
  } catch (error) {
    console.error('Failed to change password:', error);
    throw error;
  }
}

export async function uploadAvatar(dataUrlOrFile) {
  try {
    let fileToUpload = null;
    if (typeof dataUrlOrFile === 'string' && dataUrlOrFile.startsWith('data:')) {
      const arr = dataUrlOrFile.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      fileToUpload = new Blob([u8arr], { type: mime });
    } else {
      fileToUpload = dataUrlOrFile;
    }

    const formData = new FormData();
    formData.append('avatar', fileToUpload, 'avatar.jpg');

    const response = await apiClient('/admin/profile/avatar', {
      method: 'POST',
      body: formData,
    });
    return response?.data || response;
  } catch (error) {
    console.error('Failed to upload avatar:', error);
    throw error;
  }
}

const adminProfileService = {
  getAdminProfile,
  updateAdminProfile,
  requestEmailChange,
  confirmEmailChange,
  changePassword,
  uploadAvatar,
};

export default adminProfileService;
