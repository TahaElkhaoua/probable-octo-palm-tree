import React, { createRef, useRef, useState, LegacyRef } from 'react'
import Konva from 'konva';
import { Group, Rect, Label, Text } from 'react-konva'
import { Model, Coords, Relation, IAttribute } from './Controller'
import { LineV } from './LineV'

interface ModelProps {
    key: any,
    index: number,
    model: Model,
    contained: (pos: Coords) => Model | null | void
}
//create seperate Component to hold all attributes
const RenderRect = (model: Model, contained: any, setDrag: any, attribute: IAttribute | string, index: number, width: number, height: number, pos: Coords, textConf: {} = {}, rectConf: {} = {}, dragConf: {} = {}) => {

    const editText = (ref: React.RefObject<Konva.Text>, attribute: IAttribute | string, index: number, x: number, y: number, height: number, width: number) => () => {
        ref.current!.hide()
        const area = document.createElement('input')
        document.querySelector('#root')?.appendChild(area)

        area.className = 'edit-text-area'
        area.style.position = 'absolute'
        area.style.left = x + 'px'
        area.style.top = model.pos.y + y + 'px'
        area.style.height = height + 'px'
        area.style.width = width + 'px'
        area.focus()

        const event = function(){
            const updatedText = area.value;
            if(typeof attribute === 'string'){
                model.setLabel(updatedText)
            }else {
                attribute.label = updatedText
                model.updateMethod(attribute, index)
            }
            document.querySelector('#root')?.removeChild(area)
            ref.current!.show()
        }
        area.addEventListener('focusout', event)
        area.addEventListener('keydown', function(key){
            if(key.key === 'Enter') area.blur()
        })
    }
 
 
    const txtRef = useRef<Konva.Text>(null)
    const grpRef = useRef<Konva.Group>(null)

    const handleDragEnd = (evt: any) => {
        const swapModel = contained({x: (evt.evt.screenX + (model.width / 2) ), y:  evt.evt.screenY})
        if(swapModel && swapModel !== model){
            model.removeAttribute(index)
            swapModel.addAttribute(attribute as IAttribute)
            console.log(model.attributes, swapModel.attributes)
        }else {
            grpRef.current?.setPosition({y: 0, x: 0})
        }
         setDrag(true)
    }
    const dragStart = () => {
         setDrag(false)
    }

        return (
            <Group key={pos.y} 
            width={width}
            height={height}
            ref={grpRef}
                draggable
                onDragStart={dragStart}
                onDragEnd={handleDragEnd}
                {...dragConf}
            >
                <Rect 
                 width={width}
                 height={height}
                 x={0}
                 y={pos.y}
                 {...rectConf}
                 fill={"#ffffff"}
                 />
                    <Text text={(typeof attribute === 'string' ) ? attribute : `${attribute.label}: ${attribute.type}`}
                    width={width}
                    height={height}
                    x={0}
                    y={pos.y}
                    padding={25}
                    align={'left'}
                    verticalAlign={'middle'}
                    fill={"#69697f"}
                    fontFamily={"Fira Sans, Raleway"}
                    fontSize={11}
                    {...textConf}
                    ref={txtRef}
                    onDblClick={editText(txtRef, attribute, index, pos.x, pos.y, height, width)}
                     />
            </Group>
        )
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
                            points={rel.flattenPoints()}
                            key={`${i}-relation`}
                          />
                        ))
                      }       
      
            <Group draggable={false}
                //onDragMove={syncPos}
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
            {RenderRect( props.model, props.contained, setDrag, props.model.label.toUpperCase() , 0
                        , props.model.width, props.model.height, props.model.attributePos(0), {
                            align: 'center',
                            fontStyle: 'bold',
                            fontFamily: " Raleway",
                        }, {
                            fill: '#636e72',
                            strokeBottom: "#f1f1f1",
                        }, {
                            draggable: false,
                            onDragStart: () => setDrag(true),
                            onDragEnd: () => setDrag(true)
                        })}
            {
                props.model.attributes.map((att, i) => 
                RenderRect(props.model, props.contained, setDrag,
                        att, i
                        , props.model.width, props.model.height, props.model.attributePos(i+1))
                    )
            }
            </Group>
        </>
    )
}
