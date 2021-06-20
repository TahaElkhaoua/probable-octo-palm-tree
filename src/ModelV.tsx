import React, { createRef, useRef, useState, LegacyRef } from 'react'
import Konva from 'konva';
import { Group, Rect, Label, Text } from 'react-konva'
import { Model, Coords, Relation } from './Controller'
import { LineV } from './LineV'

interface ModelProps {
    height: number;
    width: number;
    totalHeight: number;
    x: number;
    y: number;
    index: number;
    label: string;
    attributes: string[],
    relations: Relation[],
    update: (index: number, position: Coords) => void
}

export function ModelV(props: ModelProps){
    const ref = useRef<Konva.Group>(null)
    const renderRect = (label: string, width: number, height: number, pos: Coords, textConf: {} = {}, rectConf: {} = {}) => {
            return (
                <Group key={pos.y}>
                    <Rect 
                     width={width}
                     height={height}
                     x={pos.x}
                     y={pos.y}
                     {...rectConf}
                     fill={"#ffffff"}
                     />
                        <Text text={label}
                           width={width}
                           height={height}
                           x={pos.x}
                           y={pos.y}
                           padding={25}
                        align={'left'}
                        verticalAlign={'middle'}
                        fill={"#69697f"}
                        fontFamily={"Fira Sans, Raleway"}
                        fontSize={11}
                        {...textConf}
                         />
                </Group>
            )
    }
    const syncPos = (evt: any) => {
        props.update(props.index, {
                x: evt.target.x(),
                y: evt.target.y()
            })

    }
    const attributePos = (index: number): Coords => {
        return {
            x:  0,
            y:  (props.height * index)
        }
      }

    return (
        <>
         
                  {props.relations.map((rel, i) => (
                          <LineV 
                            points={rel.flattenPoints()}
                            key={`${i}-relation`}
                          />
                        ))
                      }       
        <Group draggable 
            onDragMove={syncPos}
            x={props.x}
            y={props.y}
            ref={ref}
        >
            <Rect
              width={props.width}
              height={props.totalHeight}
              fill={"#69697f"}
              x={0}
              y={0}
              />


            {renderRect( props.label.toUpperCase()
                        , props.width, props.height, attributePos(0), {
                            align: 'center',
                            fontStyle: 'bold',
                            fontFamily: " Raleway",
                        }, {
                            fill: '#636e72',
                            strokeBottom: "#f1f1f1"
                        })}
            {
                props.attributes.map((att, i) => 
                    renderRect(
                        att
                        , props.width, props.height, attributePos(i+1))
                    )
            }
            </Group>
        </>
    )
}
