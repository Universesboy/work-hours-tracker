import React from 'react';
import { UserInfo } from '../types';
import { getMonthName } from '../utils/dateUtils';

interface UserInfoFormProps {
  userInfo: UserInfo;
  onUserInfoChange: (field: keyof UserInfo, value: string | number) => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ userInfo, onUserInfoChange }) => {
  return (
    <div className="card">
      <h2>User Information</h2>
      <div className="user-info-form">
        <label>
          Name
          <div className="form-control">
            <input 
              type="text" 
              value={userInfo.name} 
              onChange={(e) => onUserInfoChange('name', e.target.value)} 
              placeholder="Enter your name"
            />
          </div>
        </label>
        <label>
          Month
          <div className="form-control">
            <select 
              value={userInfo.month} 
              onChange={(e) => onUserInfoChange('month', parseInt(e.target.value))}
            >
              {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>
                  {getMonthName(m)}
                </option>
              ))}
            </select>
          </div>
        </label>
        <label>
          Year
          <div className="form-control">
            <input 
              type="number" 
              value={userInfo.year} 
              onChange={(e) => onUserInfoChange('year', parseInt(e.target.value))}
            />
          </div>
        </label>
      </div>
    </div>
  );
};

export default UserInfoForm; 