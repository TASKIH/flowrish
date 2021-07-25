import React, {useCallback, useEffect, useState} from 'react';
import ReactFlow, {
    addEdge,
    Controls,
    MiniMap,
    ReactFlowProvider,
    removeElements,
    updateEdge, useStoreState, useUpdateNodeInternals, useZoomPanHelper
} from 'react-flow-renderer';
import {initialElements} from "./initiate/initialElements";
import ButtonEdge from "./ButtonEdge";
import localforage from 'localforage';
import CustomNode from "./CustomNode";
import Button from "@material-ui/core/Button";

localforage.config({
    name: 'react-flow-docs',
    storeName: 'flows',
});

const edgeTypes = {
    buttonedge: ButtonEdge,
};
const nodeTypes = {
    selected: CustomNode,
};

const getNodeId = () => `randomnode_${+new Date()}`;

const flowKey = 'example-flow';

export default () => {
    const [rfInstance, setRfInstance] = useState(null);
    const [elements, setElements] = useState([]);
    const { transform } = useZoomPanHelper();

    const transformState = useStoreState((store) => store.transform);

    const onElementsRemove = (elementsToRemove) =>
        setElements((els) => removeElements(elementsToRemove, els));
    const onEdgeUpdate = (oldEdge, newConnection) =>
        setElements((els) => updateEdge(oldEdge, newConnection, els));

    const onLoad = useCallback((reactFlowInstance) => {
        setRfInstance(reactFlowInstance);
    } ,[]);

    const changeElementStatus = useCallback((targetElementId, obj, otherObjOverwrite={}) => {
        setElements((els) =>
            els.map((el) => {
                if (el.id === targetElementId) {
                    el = obj;
                } else if (!el.source) {
                    el = {...el, ...otherObjOverwrite};
                }
                return el;
            })
        );
    }, [setElements]);
    const changeElementData = useCallback((targetElementId, data, otherObjOverwrite={}, initType=true) => {
        setElements((els) =>
            els.map((el) => {
                if (el.id === targetElementId) {
                    el.data = {...el.data, ...data};
                    if (initType) {
                        el.type = "default";
                    }
                } else {
                    el.data = {...el.data, ...otherObjOverwrite};
                }
                return el;
            })
        );
    }, [setElements]);
    const changeEdgeData = useCallback((targetElementId, label) => {
        setElements((els) =>
            els.map((el) => {
                if (el.id === targetElementId) {
                    el.label = label;
                }
                return el;
            })
        );
    }, [setElements]);
    const removeNode = useCallback((targetElementId) => {
        setElements((els) =>
            els.filter((el) => {
                if (el.id === targetElementId) {
                    return false
                }
                if (el.source && el.target) {
                    return el.source !== el.id || el.target !== el.id;
                }
                return true;
            })
        );
    }, []);
    const removeEdge = useCallback((targetElementId) => {
        setElements((els) =>
            els.filter((el) => {
                if (el.id === targetElementId) {
                    return false
                }
                return true;
            })
        );
    }, []);
    const toggleMoving = useCallback((targetElementId) => {
        setElements((els) =>
            els.map((el) => {
                if (el.id === targetElementId) {
                    el.animated = !el.animated;
                }
                return el;
            })
        );
    }, []);
    const addFunctions = useCallback((dataElement) => {
        return dataElement.map(elm => {
            return {
                ...elm,
                data: {
                    ...elm.data,
                    id: elm.id,
                    changeElementData: changeElementData,
                    removeNode: removeNode,
                    toggleMoving: toggleMoving,
                    removeEdge: removeEdge,
                    changeEdgeData: changeEdgeData,
            }
        }});
    }, [changeEdgeData, changeElementData, removeEdge, removeNode, toggleMoving]);
    const onConnect = useCallback((params) =>
    {
        const edges =  addFunctions(addEdge({ ...params, type: 'buttonedge' }, elements));
        setElements(edges);
    }, [addFunctions, elements]);

    const removeFunctions = useCallback((object) => {
        object.elements = object.elements.map(elm => {
            return {
                ...elm,
                data: {
                    ...elm.data,
                    changeElementData: "",
                    removeNode: "",
                    removeEdge: "",
                    toggleMoving: "",
                    changeEdgeData: "",
                }
            }
        });
        return object;
    }, []);
    // エレメントがクリックされた時
    const onElementClick = useCallback((event, element) =>
    {
        if (element.type != "buttonedge") {
            changeElementStatus(element.id,
                {...element, type:"selected"},
                {type:"default"});
        }
    }, [changeElementStatus]);
    const onSave = useCallback(() => {
        if (rfInstance) {
            const flow = removeFunctions(rfInstance.toObject());
            const str = JSON.stringify(flow);
            setElements(addFunctions(elements));

            function download(content, fileName, contentType) {
                const a = document.createElement("a");
                const file = new Blob([content], { type: contentType });
                a.href = URL.createObjectURL(file);
                a.download = fileName;
                a.click();
            }

            download(str, "simple-flow-chart.json", "application/json");
        }
    }, [addFunctions, elements, removeFunctions, rfInstance]);

    const onRestore = useCallback((e) => {
        /*
        if (flow) {
            const [x = 0, y = 0] = flow.position;
            setElements(addFunctions(flow.elements) || []);
            transform({ x, y, zoom: flow.zoom || 0 });
        }
        */
        e.preventDefault()
        try {
            const reader = new FileReader()
            reader.onload = async (e) => {
                const flow2 = JSON.parse(e.target.result);
                const [x = 0, y = 0] = flow2.position;
                setElements([]);
                setTimeout(() => {
                    setElements(addFunctions(flow2.elements) || []);
                    transform({ x, y, zoom: flow2.zoom || 0 });
                    if (rfInstance) {
                        rfInstance.fitView();
                    }
                }, 100);
            };
            reader.readAsText(e.target.files[0]);
        } catch (e) {
            console.log(e);
        }
    }, [addFunctions, rfInstance, transform, setElements]);

    const onAdd = useCallback(() => {
        const id = getNodeId();
        const project = rfInstance.project({x: 0, y: 0});
        const newNode = {
            id: id,
            data: {
                id: id,
                label: '新しいノード',
                changeElementData: changeElementData,
                removeNode: removeNode,
                removeEdge: removeEdge,
                toggleMoving: toggleMoving,
                changeEdgeData: changeEdgeData,
            },
            position: {
                x: (project.x + (window.innerWidth)/transformState[2].toFixed(2) / 2),
                y: (project.y + (window.innerHeight/transformState[2].toFixed(2) - 32) / 2),
            },
        };
        setElements((els) => els.concat(newNode));
    }, [changeEdgeData, changeElementData, removeEdge, removeNode, rfInstance, toggleMoving, transformState]);

    useEffect(() => {
        setElements(initialElements.map((elm) => {
            return {...elm,
                data: {
                    id: elm.id,
                    ...elm.data,
                    changeElementData: changeElementData,
                    removeNode: removeNode,
                    removeEdge: removeEdge,
                    toggleMoving: toggleMoving,
                    changeEdgeData: changeEdgeData,
                }
        };
        }));
        if (rfInstance) {
            rfInstance.fitView();
        }
    }, [changeEdgeData, changeElementData, removeEdge, removeNode, rfInstance, toggleMoving]);
    return (
        <div className="body-div">
            <div className="header-control">
                <Button color="primary" onClick={onSave}>Save</Button>
                <Button
                    component="label"
                    onChange={onRestore}
                    color="secondary"
                >
                    Load
                    <input
                        type="file"
                        accept="application/json"
                        hidden
                    />
                </Button>
                <Button onClick={onAdd}>Add Box</Button>
            </div>
            <div className="flow-canvas">
                <ReactFlow
                    elements={elements}
                    onElementClick={onElementClick}
                    onElementsRemove={onElementsRemove}
                    onConnect={onConnect}
                    onEdgeUpdate={onEdgeUpdate}
                    onLoad={onLoad}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    deleteKeyCode={46} /* 'delete'-key */
                >
                </ReactFlow>
            </div>
            <Controls />
        </div>
    );
};