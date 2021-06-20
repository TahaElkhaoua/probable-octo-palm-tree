import { Group, Line } from "react-konva"
import { Model } from './Controller'

interface LineVProps {
    points: number[],
    key: any,
}

export function LineV(props: LineVProps){
    return (
        <Group>
            <Line
                points={props.points}
                stroke={"#ffc62d"}
            />
        </Group>
    )
}