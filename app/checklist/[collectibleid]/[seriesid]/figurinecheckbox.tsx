"use client"

import {useState} from "react"
import {Checkbox} from "@mui/material"

export default function FigurineCheckbox(props: any) {
  const { figurineid, ownedstatus, userid } = props;

  const [checked, setChecked] = useState(ownedstatus);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setChecked(newValue);

    await fetch("/api/updateOwned", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userid,
        figurineid,
        owned: newValue,
      }),
    });
  };

  return <Checkbox checked={checked} onChange={handleChange} />;
}