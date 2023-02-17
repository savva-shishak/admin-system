import { Checkbox, CircularProgress } from '@material-ui/core';
import { useState } from 'react';
import { sendAction } from '../../App';

export function TableCheckbox({ value, row, actionId }: { value: any, row: any, actionId: string }) {
  const [checked, setChecked] = useState(value);
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <CircularProgress size={38} />
  }

  console.log(actionId);
  

  return (
    <Checkbox 
      checked={checked}
      onClick={async () => {
        setLoading(true);
        const newValue = await sendAction(actionId, { row, newValue: !checked });
        setChecked(newValue);
        setLoading(false);
      }}
    />
  );
}