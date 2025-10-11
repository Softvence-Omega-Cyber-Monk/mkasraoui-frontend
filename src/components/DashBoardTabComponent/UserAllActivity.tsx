import MyCustomOrder from "./MyCustomOrder";
import MyGeneralOrder from "./MyGeneralOrder";
import PaymentTab from "./PaymentTab";

const UserAllActivity = () => {
  return (
    <div className="space-y-8">
      <PaymentTab />
      <MyGeneralOrder />
      <MyCustomOrder />
    </div>
  );
};

export default UserAllActivity;
