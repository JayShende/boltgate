import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";
const Dash = () => {
  return (
    <div>
      Hello Ji
      <Button
        variant="destructive"
        onClick={async () => {
          "use server";
          await signOut();
        }}
      >SignOut </Button>
    </div>
  );
};

export default Dash;
