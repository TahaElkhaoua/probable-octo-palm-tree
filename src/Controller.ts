import { updateFor } from 'typescript';
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

export interface IAttribute {
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
        public observer : () => void = () => null
    ){}

    public updateMethod = (updatedMethod: IAttribute, index: number) => {
        this.attributes.splice(index, 1, updatedMethod)
        this.notifyObserver()
    }

    public registerObserver(observer: () => void) {
        this.observer = observer
    }

    public notifyObserver(){
        this.observer()
    }

    public addAttribute(attribute: IAttribute): void {
        this.attributes.push({...attribute})
    }
    public removeAttribute(index: number): void {
        const tmp = [...this.attributes].splice(index, 1)
        this.attributes = tmp
    }

    public setLabel(label: string){
        this.label = label
        this.notifyObserver()
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
            const pos = this.attributePos(rel.index)
            pos.y = pos.y + this.pos.y
            
            rel.points[rel.points.length - 1] = {x: pos.x, y: pos.y + (this.height / 2)}
        })
        this.notifyObserver()
    }

    get pos(): Coords {
        return this.position
    }

    public addRelation(rel: Relation): void{
        const pos = this.attributePos(rel.index)
        pos.y = pos.y + this.pos.y

        rel.points.push(pos)
        this.relations.push(rel)
    }

    public attributePos(index: number): Coords {
      return {
          x: this.pos.x,
          y: (this.height * index)
      }
    }

    public contained(pos: Coords): boolean {
        if(pos.x > (this.pos.x - (this.width / 2))
         && pos.x < (this.pos.x + (this.width * 1.5))
          && pos.y > (this.pos.y + this.height)
           && pos.y < (this.pos.y + this.height + this.totalHeight)){
            console.log('contained in ' + this.label)
            return true
        }
        return false
    }
}

