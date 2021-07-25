import React, {useCallback, useEffect, useState} from 'react';
import {
    getBezierPath,
    getEdgeCenter,
    getMarkerEnd, Handle,
} from 'react-flow-renderer';

import './index.css';
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const foreignObjectSize = 90;



const onEdgeClick = (evt, id) => {
    evt.stopPropagation();
    alert(`remove ${id}`);
};

export default function CustomEdge({
                                       id,
                                       sourceX,
                                       sourceY,
                                       targetX,
                                       targetY,
                                       label,
                                       labelStyle,
                                       labelShowBg,
                                       labelBgStyle,
                                       labelBgPadding,
                                       labelBgBorderRadius,
                                       sourcePosition,
                                       targetPosition,
                                       style = {},
                                       data,
                                       selected,
                                       arrowHeadType,
                                       markerEndId,
                                   }) {
    const [inputLabel, setInputLabel] = useState(label);
    const edgePath = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
    const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
    const [edgeCenterX, edgeCenterY] = getEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });
    const handleOK = useCallback(() => {
        data.changeEdgeData(
            data.id,
            inputLabel
        );
    }, [data, inputLabel]);
    const handleRemoved = useCallback(() => {
        data.removeEdge(data.id);
    }, [data]);
    const handleMoving = useCallback(() => {
        data.toggleMoving(data.id);
    }, [data]);
    const handleLabel = useCallback((evt) => {
        setInputLabel(evt.target.value);
    }, []);
    useEffect(() => {
        setInputLabel(label);
    }, [label, selected]);
    return (
        <>
            <path
                id={id}
                style={style}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
            />
            <foreignObject
                width={foreignObjectSize * 2}
                height={foreignObjectSize}
                x={edgeCenterX - foreignObjectSize}
                y={edgeCenterY - foreignObjectSize / 2}
                className="edgebutton-foreignobject"
                requiredExtensions="http://www.w3.org/1999/xhtml"
            >
                <body>
                {!selected && (
                    <React.Fragment>
                        <div className="text-align-center">
                            <Typography>
                                {label}
                            </Typography>
                        </div>
                    </React.Fragment>
                )}
                {selected && (
                    <React.Fragment>

                        <TextField id="standard-basic" value={inputLabel} onChange={handleLabel}/>
                        {label !== inputLabel && (
                            <Button color="primary" onClick={handleOK}>
                                保存
                            </Button>
                        )}
                        <IconButton onClick={handleMoving}>
                            <TrendingUpIcon fontSize="small"/>
                        </IconButton>
                        <IconButton aria-label="delete" onClick={handleRemoved}>
                           <DeleteIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                )}
                </body>
            </foreignObject>
        </>
    );
}