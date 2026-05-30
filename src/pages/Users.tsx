import Heading from "../ui/Heading";
import SignupForm from "../features/authentication/SignupForm";

function NewUsers() {
  return (
    <>
      <div className="page-titlebar">
        <Heading as="h1">
          Create a <span className="accent-text">new user</span>
        </Heading>
        <p className="page-subtitle">Invite teammates to collaborate</p>
      </div>
      <SignupForm />
    </>
  );
}

export default NewUsers;
