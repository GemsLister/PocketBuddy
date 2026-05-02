// import ExpenseScreen from "@/screens/tabs/ExpenseScreen";
// import IncomeScreen from "@/screens/tabs/IncomeScreen";
// import TransferScreen from "@/screens/tabs/TransferScreen";
// import SegmentedControl from "@react-native-segmented-control/segmented-control";
// import { useState } from "react";
// export default function SegmentedButton() {
//   const [value, setValue] = useState("income");
//   const [selectedIndex, setSelectedIndex] = useState(1);
//   const renderContent = () => {
//     switch (value) {
//       case "expense":
//         return <ExpenseScreen />;
//       case "income":
//         return <IncomeScreen />;
//       case "tranfer":
//         return <TransferScreen />;
//     }
//   };
//   return (
//     <SegmentedControl
//       values={["Expense", "Income", "Transfer"]}
//       selectedIndex={selectedIndex}
//       onChange={(event) => {
//         setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
//       }}
//       className="font-nunito-semibold"
//     />
//   );
// }
