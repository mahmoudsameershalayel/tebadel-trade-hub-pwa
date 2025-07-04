
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ProfileService } from '@/services/profile-service';
import { UserProfileDto, UpdateProfileDto } from '@/types/profile';
import { User, Upload, Loader, Eye, EyeOff } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [showReferralCode, setShowReferralCode] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await ProfileService.getProfile();
      setProfile(profileData);
      
      // Split full name into first and last name
      const nameParts = profileData.fullName.split(' ');
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phoneNumber: profileData.phoneNumber,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
    };

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setUpdating(true);
      const updateData: UpdateProfileDto = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      };

      await ProfileService.updateProfile(updateData);
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });

      // Refresh profile data
      await fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: t('common.error'),
        description: 'Please select a valid image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t('common.error'),
        description: 'Image size must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    try {
      setImageUploading(true);
      await ProfileService.uploadProfileImage(file);
      
      toast({
        title: 'Success',
        description: 'Profile image updated successfully',
      });

      // Refresh profile data
      await fetchProfile();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Profile not found</h2>
          <Button onClick={fetchProfile}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 py-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Header */}
          <div className="px-6 py-4 border-b">
            <h1 className="text-2xl font-bold text-gray-900">
              {t('nav.profile')}
            </h1>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Image Section */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mx-auto">
                      {profile.imageURL ? (
                        <img
                          src={profile.imageURL}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={imageUploading}
                      className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {imageUploading ? (
                        <Loader className="animate-spin h-4 w-4" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Click to upload new image
                  </p>
                </div>

                {/* Read-only Info */}
                <div className="mt-8 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800">
                      {profile.username}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800">
                      {profile.email}
                    </div>
                  </div>

                  {profile.myPoints !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Points
                      </label>
                      <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800 font-semibold">
                        {profile.myPoints}
                      </div>
                    </div>
                  )}

                  {profile.referralCode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Referral Code
                      </label>
                      <div className="flex items-center">
                        <div className="flex-1 px-3 py-2 bg-gray-50 rounded-md text-gray-800 font-mono">
                          {showReferralCode ? profile.referralCode : '••••••••'}
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowReferralCode(!showReferralCode)}
                          className="ml-2 p-2 text-gray-500 hover:text-gray-700"
                        >
                          {showReferralCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Editable Form Section */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('auth.firstName')}
                      </label>
                      <Input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder={t('auth.firstNameHolder')}
                        className={errors.firstName ? 'border-red-500' : ''}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('auth.lastName')}
                      </label>
                      <Input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder={t('auth.lastNameHolder')}
                        className={errors.lastName ? 'border-red-500' : ''}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('auth.phone')}
                    </label>
                    <Input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder={t('auth.phoneHolder')}
                      className={errors.phoneNumber ? 'border-red-500' : ''}
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={updating}
                      className="min-w-[120px]"
                    >
                      {updating ? (
                        <>
                          <Loader className="animate-spin h-4 w-4 mr-2" />
                          Updating...
                        </>
                      ) : (
                        t('common.save')
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
