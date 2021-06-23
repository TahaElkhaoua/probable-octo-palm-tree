import { useRef } from 'react'
import { Model, IAttribute, Coords } from './Controller'
import Konva from 'konva'
import { Group, Text, Rect } from 'react-konva'

interface AttributeProps {
    model: Model; 
    contained: any; 
    setDrag: any; 
    attribute: IAttribute | string; 
    index: number;
    width: number;
    height: number; 
    pos: Coords;
    textConf?: {};
    rectConf?: {};
    dragConf?: {};
}

export function AttributeV(props: AttributeProps) {


    
    const editText = (ref: React.RefObject<Konva.Text>, attribute: IAttribute | string, index: number, x: number, y: number, height: number, width: number) => () => {
        ref.current!.hide()
        const area = document.createElement('input')
        document.querySelector('#root')?.appendChild(area)

        area.className = 'edit-text-area'
        area.style.position = 'absolute'
        area.style.left = x + 'px'
        area.style.top = props.model.pos.y + y + 'px'
        area.style.height = height + 'px'
        area.style.width = width + 'px'
        area.focus()

        const event = function(){
            const updatedText = area.value;
            if(typeof attribute === 'string'){
                props.model.setLabel(updatedText)
            }else {
                attribute.label = updatedText
                props.model.updateMethod(attribute, index)
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
        const swapModel = props.contained({x: (evt.evt.screenX + (props.model.width / 2) ), y:  evt.evt.screenY})
        if(swapModel && swapModel !== props.model){
            swapModel.addAttribute(props.attribute as IAttribute)
            props.model.removeAttribute(props.index)
        }else {
        }
        grpRef.current?.setPosition({y: 0, x: 0})
        props.model.notifyObserver()
        props.setDrag(true)
    }
    const dragStart = () => {
        props.setDrag(false)
    }

        return (
            <Group key={props.pos.y} 
            width={props.width}
            height={props.height}
            ref={grpRef}
                draggable
                onDragStart={dragStart}
                onDragEnd={handleDragEnd}
                {...(props.dragConf || {})}
            >
                <Rect 
                 width={props.width}
                 height={props.height}
                 x={0}
                 y={props.pos.y}
                 fill={"#ffffff"}
                 {...(props.rectConf||{})}
                 />
                    <Text text={(typeof props.attribute === 'string' ) ? props.attribute : `${props.attribute.label}: ${props.attribute.type}`}
                    width={props.width}
                    height={props.height}
                    x={0}
                    y={props.pos.y}
                    padding={25}
                    align={'left'}
                    verticalAlign={'middle'}
                    fill={"#69697f"}
                    fontFamily={"Fira Sans, Raleway"}
                    fontSize={11}
                    ref={txtRef}
                    onDblClick={editText(txtRef, props.attribute, props.index, props.pos.x, props.pos.y, props.height, props.width)}
                    {...(props.textConf||{})}
                     />
            </Group>
        )
}