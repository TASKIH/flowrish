import React, {memo, useCallback, useState} from 'react';

import {Handle, useStoreActions, useStoreState} from 'react-flow-renderer';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';

export default memo(({ data, isConnectable }) => {
    console.log(data);
    const [name, setName] = useState(data.label);

    const handleChange = (event) => {
        setName(event.target.value);
    };
    const handleOK = useCallback(() => {
        data.changeElementData(
            data.id,
            {
                ...data.data,
                label: name,
            }, {},true);
    }, [data, name]);
    const handleCancel = useCallback(() => {
        data.changeElementData(
            data.id,
            {
            },{}, true);
    }, [data]);
    const handleRemoved = useCallback(() => {
        data.removeNode(data.id);
    }, [data]);
    return (
        <>
            <Handle
                type="target"
                position="top"
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable={isConnectable}
            />
            <TextField id="standard-basic" value={name} onChange={handleChange}/>

            <Button color="primary" onClick={handleOK}>
                OK
            </Button>
            <Button color="secondary" onClick={handleCancel}>
                Cancel
            </Button>
            <IconButton aria-label="delete" onClick={handleRemoved}>
                <DeleteIcon fontSize="small" />
            </IconButton>
            <Handle
                type="source"
                position="bottom"
                id="a"
                style={{ background: '#555' }}
                isConnectable={isConnectable}
            />
        </>
    );
});