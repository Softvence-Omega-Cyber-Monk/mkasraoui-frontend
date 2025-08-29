import user from "@/assets/profile-user.png";
import { useState } from "react";
import { Link } from "react-router-dom";

type Settings = {
  emailNotifications: boolean;
  marketingEmails: boolean;
  smsReminders: boolean;
};

function ProfileTab() {
  const [settings, setSettings] = useState<Settings>({
    emailNotifications: true,
    marketingEmails: false,
    smsReminders: true,
  });

  const toggleSetting = (key: keyof Settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div>
      <div className="flex flex-col items-start justify-center gap-6 p-4 md:p-6 lg:flex-row lg:p-8">
        {/* Profile Information Card */}
        <div className="w-full rounded-2xl border-2 border-[#DFE1E6] bg-white md:max-w-lg">
          <div className="p-6 pb-2">
            <h2 className="text-xl font-semibold text-gray-800">
              Profile Information
            </h2>
          </div>
          <div className="grid gap-6 p-6 pt-0">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border border-gray-200">
                <img
                  src={user}
                  alt="Sarah Johnson"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid gap-1">
                <div className="text-lg font-medium whitespace-nowrap text-gray-900">
                  Sarah Johnson
                </div>
                <div className="text-sm text-gray-500">
                  Member since January 2024
                </div>
                <span className="inline-block w-full rounded-md bg-[#C5FFD9] px-2 py-2 text-center text-xs font-medium whitespace-nowrap text-[#39B42E] md:w-1/2">
                  Pro Member
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="fullName"
                className="text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="fullName"
                defaultValue="Sarah Johnson"
                className="flex h-10 w-full rounded-md border border-[#C6CAD1] bg-white px-3 py-3 text-sm text-[#00000099] placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                type="text"
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                defaultValue="sarah@example.com"
                className="flex h-10 w-full rounded-md border border-[#C6CAD1] bg-white px-3 py-3 text-sm text-[#00000099] placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                type="email"
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                id="phone"
                defaultValue="+1 (555) 123-4567"
                className="flex h-10 w-full rounded-md border border-[#C6CAD1] bg-white px-3 py-3 text-sm text-[#00000099] placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                type="tel"
              />
            </div>
            <button className="mt-2 inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-md bg-[#223B7D] px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-[#2C4890]/90">
              Update Profile
            </button>
          </div>
        </div>

        {/* Account Settings Card */}
        <div className="w-full rounded-2xl border-2 border-[#DFE1E6] bg-white md:max-w-md">
          <div className="p-6 pb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Account Settings
            </h2>
          </div>
          <div className="grid gap-6 p-6 pt-0">
            <div className="grid gap-4">
              <div
                onClick={() => toggleSetting("emailNotifications")}
                className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div className="grid gap-1">
                  <div className="font-medium text-gray-800">
                    Email Notifications
                  </div>
                  <div className="text-sm text-gray-500">
                    Receive party reminders and updates
                  </div>
                </div>
                {settings.emailNotifications ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#22C55E] text-lg text-white">
                    ✓
                  </div>
                ) : (
                  <div className="h-6 w-6 rounded-sm border border-gray-300 bg-white" />
                )}
              </div>

              <div
                onClick={() => toggleSetting("marketingEmails")}
                className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div className="grid gap-1">
                  <div className="font-medium text-gray-800">
                    Marketing Emails
                  </div>
                  <div className="text-sm text-gray-500">
                    Get tips and special offers
                  </div>
                </div>
                {settings.marketingEmails ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#22C55E] text-lg text-white">
                    ✓
                  </div>
                ) : (
                  <div className="h-6 w-6 rounded-sm border border-gray-300 bg-white" />
                )}
              </div>

              <div
                onClick={() => toggleSetting("smsReminders")}
                className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div className="grid gap-1">
                  <div className="font-medium text-gray-800">SMS Reminders</div>
                  <div className="text-sm text-gray-500">
                    Text reminders for important dates
                  </div>
                </div>
                {settings.smsReminders ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#22C55E] text-lg text-white">
                    ✓
                  </div>
                ) : (
                  <div className="h-6 w-6 rounded-sm border border-gray-300 bg-white" />
                )}
              </div>
            </div>
            <Link to="/auth/reset-password">
              <button className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-md bg-[#223B7D] px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-[#2C4890]/90">
                Change Password
              </button>
            </Link>
            <button className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-[#FF5630] bg-transparent px-4 py-2 text-sm font-medium whitespace-nowrap text-[#EF4444] transition-colors hover:bg-[#EF4444]/5">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileTab;
