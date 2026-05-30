import Heading from "../ui/Heading";
import UpdateUserDataForm from "../features/authentication/UpdateUserDataForm";
import UpdatePasswordForm from "../features/authentication/UpdatePasswordForm";

function Account() {
  return (
    <>
      <div className="page-titlebar">
        <Heading as="h1">
          Update your <span className="accent-text">account</span>
        </Heading>
        <span className="chip">Security</span>
      </div>

      <div className="space-y-12">
        <section className="space-y-6">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <Heading as="h3">Update user data</Heading>
            <p className="page-subtitle">Profile & avatar</p>
          </div>
          <div className="max-w-[92rem]">
            <UpdateUserDataForm />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <Heading as="h3">Update password</Heading>
            <p className="page-subtitle">Minimum 8 characters</p>
          </div>
          <div className="max-w-[92rem]">
            <UpdatePasswordForm />
          </div>
        </section>
      </div>
    </>
  );
}

export default Account;
