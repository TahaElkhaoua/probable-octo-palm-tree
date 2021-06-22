import { useState, useRef, createRef } from 'react'
import Konva from 'konva'
import { Group, Rect, Text } from 'react-konva'
import { Coords, Components as ComponentsTypes } from './Controller'


interface ComponentsProps {
    callCreate(comp: ComponentsTypes, pos: Coords) : void
}


export function Components(props: ComponentsProps) {
    const ref : React.RefObject<Konva.Rect> = createRef()
    const [pos, setPos] = useState<Coords>({
        x: 50,
        y: 50
    })

    const dragMove = () => {
        ref.current?.scale({x: .95, y: .95})
    }
    const dragEnd = (evt: any) => {
        const x = evt.target.x() ;
        const y =  evt.target.y()
        
        ref.current?.setPosition(pos)
        ref.current?.scale({x: 1, y: 1})
        if(x > 250){
            props.callCreate(ComponentsTypes.Model, {
                x,
                y
            })
        }
    }
    

    return (
        <Group>
            <Rect
                x={0}
                y={0}
                height={window.innerHeight}
                width={250}
                fill={"#f3f3f3"}
            />
            <Rect
                ref={ref}
                draggable
                onDragMove={dragMove}
                onDragEnd={dragEnd}
                 {...pos}
                 fill={'#ffffff'}
                 height={60}
                 width={150}
            />
        </Group>
    )
}