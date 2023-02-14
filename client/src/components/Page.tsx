import { Button, CircularProgress } from "@material-ui/core";
import moment from "moment";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { v4 } from "uuid";
import { socket } from "../App";
import { AdaptTable } from "./AdaptTable";
import { Form } from "./form";
import { Table } from "./table/Table";

export function Page({ content, path }: { content: any[], path: string }): any {
  const params = useParams();
  const location = useLocation();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.emit('admin-message', { target: 'load', path, params });
  }, [location.pathname, path]);

  useEffect(() => {
    setLoading(false);
  }, [content.length])

  if (loading) {
    return <CircularProgress />
  }

  return content.map((component, id) => {
    console.log(component);
    
    if (component.type === 'html') {
      return <div key={Math.random()} dangerouslySetInnerHTML={{ __html: component.payload }} />
    }

    if (component.type === 'form') {
      return <Form key={Math.random()} config={component.config} />
    }

    if (component.type === 'table') {
      return <AdaptTable key={Math.random()} config={component.config} />
    }
  })
}