import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

export default function App() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["pending"]));

  console.log("test.js ->", selectedKeys);

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  return (
    <Dropdown className="text-black">
      <DropdownTrigger>
        <Button variant="bordered" className="capitalize">
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Single selection example"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <DropdownItem key="pending">pending</DropdownItem>
        <DropdownItem key="delivered">delivered</DropdownItem>
        <DropdownItem key="cancelled">cancelled</DropdownItem>
        <DropdownItem key="unavailable">unavailable</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
