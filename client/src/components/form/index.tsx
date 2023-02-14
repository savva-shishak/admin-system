import { Button, Card, CardActions, CardContent, TextField } from "@material-ui/core";
import { useFormik } from "formik";
import { socket } from "../../App";

export function Form({ config }: any) {  
  const formik = useFormik({
    initialValues: config.inputs.reduce((acc: any, { value, name }: any) =>({ ...acc, [name]: value }), {}),
    onSubmit() {}
  })

  return (
    <div style={{ display: 'flex', flexFlow: 'row wrap',  }}>
      <Card style={{ width: '100%' }}>
        <CardContent style={{ display: 'grid', gridTemplateColumns: `repeat(${config.columns || 3}, 1fr)`, gap: 15 }}>
          {config
            .inputs
            .map((input: any) => {
              return (<TextField label={input.label} {...formik.getFieldProps(input.name)}/>);
            })}
        </CardContent>
        <CardActions style={{ justifyContent: 'flex-end' }}>
          {config
            .buttons
            .map((btn: any) => (
              <Button 
                color={btn.type}
                variant="contained"
                onClick={() => {
                  socket.emit('admin-message', { target: 'action', actionId: btn.handler, params: formik.values })
                }}
              >
                {btn.label}
              </Button>
            ))}
        </CardActions>
      </Card>
    </div>
  );
}