import React from 'react';

export interface LicenseErrorProps {
}

export const LicenseErrorFC: React.FC<LicenseErrorProps> = (props => {
    return (
        <div className='license-error-container'>
            Please contact your admin team to purchase the license to this user.
        </div>
    );
});

export default LicenseErrorFC;
