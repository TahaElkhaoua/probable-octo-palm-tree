import { v4 as uuid } from 'uuid'

export enum Types {
    String='String',
    Number='Number',
    Boolean='Boolean',
    Buffer='Buffer'
}

export enum Components {
    Model
}

interface IAttribute {
    label: string;
    type: Types;
}
interface IMethod {
    label: string;
    type: Types
}

export interface Coords {
    x: number;
    y: number;
}


export class Relation {
    constructor(
        public ref : Model,
        public points: Coords[],
        public index: number
    ){}

    flattenPoints(): number[]{
        return [
            this.ref.pos.x + this.ref.width,
            this.ref.pos.y + (this.ref.height / 2)
            ,...this.points.map(coord => [coord.x, coord.y]).flat()]
    }
}

export class Model {
    public height: number = 45;
    public width : number = 200;
    public key   : string = uuid()

    constructor(
        public label : string,
        public position: Coords,
        public attributes: IAttribute[] = [],
        public methods : IMethod[] = [],
        public statics: [] = [],
        public relations: Relation[] = [],
        public observers: (() => void)[] = []
    ){}



    public addAttribute(attribute: IAttribute): void {
        this.attributes.push(attribute)
    }
    public addMethod(method: IMethod): void{
        this.methods.push(method)
    }

    get totalHeight(): number {
        return this.attributes.length * this.height + 60;
    }

    setPos(coords: Coords) {
        this.position = coords

        //Update all relationships
        this.relations.forEach(rel => {
            rel.points[rel.points.length - 1] = {x: this.attributePos(rel.index).x, y: this.attributePos(rel.index).y + (this.height / 2)}
        })
    }

    get pos(): Coords {
        return this.position
    }

    public addRelation(rel: Relation): void{
        rel.points.push(this.attributePos(rel.index))
        this.relations.push(rel)
    }

    public attributePos(index: number): Coords {
      return {
          x: this.pos.x,
          y: this.pos.y + (this.height * index)
      }
    }
}

