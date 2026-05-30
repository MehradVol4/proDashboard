import UpdateSettingsForm from "../features/settings/UpdateSettingsForm";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function Settings() {
  return (
    <Row>
      <div className="page-titlebar">
        <Heading as="h1">
          Update <span className="accent-text">hotel settings</span>
        </Heading>
        <p className="page-subtitle">Changes save on blur</p>
      </div>
      <UpdateSettingsForm />
    </Row>
  );
}

export default Settings;
