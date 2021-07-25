import React from "react";

export const initialElements = [
    {
        id: '1',
        data: { label: '出発' },
        position: { x: 250, y: 25 },
    },
    // default node
    {
        id: '2',
        // you can also pass a React component as a label
        data: { label: "潮干狩り"},
        position: { x: 100, y: 125 },
    },
    {
        id: '3',
        data: { label: '映画' },
        position: { x: 250, y: 250 },
    },
    {
        id: '4',
        data: { label: '帰宅' },
        position: { x: 250, y: 400 },
    },
    // animated edge
    { id: 'e1-2', source: '1', target: '2',
        type: 'buttonedge', animated: true, label: '晴れたら'},
    { id: 'e1-3', source: '1', target: '3',
        type: 'buttonedge', label: '雨が降ったら'},
    { id: 'e2-4', source: '2', target: '4',
        type: 'buttonedge',animated: true, },
    { id: 'e3-4', source: '3', target: '4',
        type: 'buttonedge',},
];