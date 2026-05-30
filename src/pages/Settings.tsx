import UpdateSettingsForm from "../features/settings/UpdateSettingsForm";
import Heading from "../ui/Heading";

function Settings() {
  return (
    <div className="space-y-8">
      <div className="page-titlebar">
        <Heading as="h1">
          Update <span className="accent-text">hotel settings</span>
        </Heading>
        <p className="page-subtitle">Changes save on blur</p>
      </div>
      <div className="max-w-[92rem]">
        <UpdateSettingsForm />
      </div>
    </div>
  );
}

export default Settings;
