import React, { createRef, useRef, useState, LegacyRef } from 'react'
import Konva from 'konva';
import { Group, Rect, Label, Text } from 'react-konva'
import { Model, Coords, Relation, IAttribute } from './Controller'
import { LineV } from './LineV'
import { AttributeV } from './AttributeV'

interface ModelProps {
    key: any,
    index: number,
    model: Model,
    contained: (pos: Coords) => Model | null | void
}


export function ModelV(props: ModelProps){
    const ref = useRef<Konva.Group>(null)
    const [drag, setDrag] = useState<boolean>(true)


    

    const syncPos = (evt: any) => {
        if(!drag) return;
        props.model.setPos({
            x: evt.target.x(),
            y: evt.target.y()
        })
    }
    return (
        <>
         
                  {props.model.relations.map((rel, i) => (
                          <LineV 
                            points={rel.flattenPoints(props.model.pos)}
                            key={`${i}-relation`}
                          />
                        ))
                      }       
      
            <Group draggable={drag}
                onDragMove={syncPos}
                x={props.model.pos.x}
                y={props.model.pos.y}
                ref={ref}
            >
                <Rect
                width={props.model.width}
                height={props.model.totalHeight}
                fill={"#69697f"}
                x={0}
                y={0}
                />

                    <AttributeV 
                            model={props.model}
                            contained={props.contained}
                            setDrag={setDrag}
                            attribute={props.model.label}
                            width={props.model.width}
                            height={props.model.height}
                            pos={ props.model.attributePos(0)}
                            index={0}
                            textConf={{
                                align: 'center',
                                fontStyle: 'bold',
                                fontFamily: " Raleway",
                                fill: 'white'
                            }}
                            rectConf={{
                                fill: '#636e72',
                                strokeBottom: "#f1f1f1",
                            }}
                            dragConf={{
                                draggable: false,
                                onDragStart: () => setDrag(true),
                                onDragEnd: () => setDrag(true)
                            }}
                        />  
            {
                props.model.attributes.map((att, i) => (
                    <AttributeV 
                        model={props.model}
                        contained={props.contained}
                        setDrag={setDrag}
                        attribute={att}
                        width={props.model.width}
                        height={props.model.height}
                        pos={ props.model.attributePos(i+1)}
                        index={i}
                        key={att.label + i}
                    />
                )

                    )
            }
            </Group>
        </>
    )
}
