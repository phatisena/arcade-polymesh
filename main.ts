
//% block="poly mesh" color="#279139" icon="\uf1b2" groups='["Create","Controls","Styling"]'
namespace polymesh {

    export enum Angles {
        //% block="x"
        Angle_X,
        //% block="y"
        Angle_Y,
        //% block="z"
        Angle_Z,
    }
    export enum Cameras {
        //% block="x"
        Cam_x,
        //% block="y"
        Cam_y,
        //% block="z"
        Cam_z,
    }
    export enum MeshType {
        //% block="vertice"
        cv,
        //% block="triangle"
        ct,
    }
    export enum SortingMethods {
        //% block="accurate"
        Accurate,
        //% block="fast"
        Fast,
        //% block="fast and accurate"
        Fast_and_Accurate,
    }

    export interface cv {
        x: number
        y: number
        z: number
    }

    export interface ct {
        indices: number[]
        color: number
    }

    export interface mesh {
        cts: ct[]
        cvs: cv[]
    }

    export class cvc { constructor(public x: number, public y: number, public z: number) { } }
    //% blockid=poly_shadow_vertice
    //% block="vertice of x $x y $y z $z"
    //% x.defl=0
    //% y.defl=0
    //% z.defl=0
    export function clsvertice(x: number, y: number, z: number) {
        return new cvc(x, y, z)
    }

    export class ctc { constructor(public i1: number, public i2: number, public i3: number, public c: number) { } }
    //% blockid=poly_shadow_triangle
    //% block="triangle of idc1 $i1 idc2 $i2 idc3 $i3 color $col"
    //% i1.defl=0
    //% i2.defl=0
    //% i3.defl=0
    //% col.shadow=colorindexpicker
    export function clstriangle(i1: number, i2: number, i3: number, col: number) {
        return new ctc(i1, i2, i3, col)
    }

    //% blockid=poly_newmesh
    //% block="create new mesh"
    //% blockSetVariable=myMesh
    //% weight=100
    export function newmesh() {
        return new cmesh()
    }

    export class cmesh {
        public v: mesh

        constructor() {
            this.v.cts = [{indices: [0,0,0], color: 0}]
            this.v.cvs = [{x: 0, y: 0, z: 0}]
        }

        //% blockid=poly_addvertice
        //% block=" $this add vertice by x: $x y: $y z: $z|| at $idx"
        //% this.shadow=variables_get this.defl=myMesh
        //% ccv.shadow=poly_shadow_vertice
        //% weight=90
        public addvertice(x: number, y: number, z: number, idx: number = -1) {
            if (idx < 0) {
                this.v.cvs.insertAt(idx, { x: x, y: y, z: z })
                return
            }
            this.v.cvs.push({ x: x, y: y, z: z })
        }
    
        //% blockid=poly_addtriangle
        //% block=" $this add triangle by idc1 $i1 idc2 $i2 idc3 $i3 color $c|| at $idx"
        //% this.shadow=variables_get this.defl=myMesh
        //% c.shadow=colorindexpicker
        //% cct.shadow=poly_shadow_triangle
        //% weight=89
        public addtriangle(i1: number, i2: number, i3: number, c: number, idx: number = -1) {
            if (idx < 0) {
                this.v.cts.insertAt(idx, { indices: [i1, i2, i3], color: c })
                return
            }
            this.v.cts.push({ indices: [i1, i2, i3], color: c })
        }
    
        //% blockid=poly_addvertice
        //% block=" $this set vertice at $idx by x: $x y: $y z: $z"
        //% this.shadow=variables_get this.defl=myMesh
        //% ccv.shadow=poly_shadow_vertice
        //% weight=88
        public setvertice(idx: number, x: number, y: number, z: number) {
            this.v.cvs[idx] = { x: x, y: y, z: z }
        }
    
        //% blockid=poly_addtriangle
        //% block=" $this set triangle at $idx by idc1 $i1 idc2 $i2 idc3 $i3 color $c"
        //% this.shadow=variables_get this.defl=myMesh
        //% cct.shadow=poly_shadow_triangle
        //% c.shadow=colorindexpicker
        //% weight=87
        public settriangle(idx: number, i1: number, i2: number, i3: number, c: number) {
            this.v.cts[idx] = { indices: [i1, i2, i3], color: c }
        }
    
        //% blockid=poly_delvertice
        //% block=" $this remove vertice at $idx"
        //% this.shadow=variables_get this.defl=myMesh
        //% weight=86
        public delvertice(idx: number) {
            this.v.cvs.removeAt(idx)
        }
    
        //% blockid=poly_deltriangle
        //% block=" $this remove triangle at $idx"
        //% this.shadow=variables_get this.defl=myMesh
        //% weight=85
        public deltriangle(idx: number) {
            this.v.cts.removeAt(idx)
        }

    }

    let axchange = 0
    let azchange = 0
    let camx = 0
    let camy = 0
    let camz = 0
    let sizechange = 0
    let aychange = 0
    let sort = 2

    //% blockid=poly_rendermesh
    //% block=" $mymesh render to $image"
    //% mymesh.shadow=variables_get mymesh.defl=myMesh
    //% image.shadow=screen_image_picker
    //% weight=80
    export function render(mymesh: cmesh, image: Image) {
        function updateCube() {
            let bg = image;
            let bgsave = bg.clone()
            let angleX = 0;
            angleX += axchange
            let angleY = 0;
            let angleZ = 0;
            angleY += aychange
            angleZ += azchange
            let centerX = scene.screenWidth() / 2;
            let centerY = scene.screenHeight() / 2;
            let size = 1
            size += sizechange

            let vertices = mymesh.v.cvs;
            let triangles = mymesh.v.cts;
            mymesh.v.cts = [
                { indices: [0, 0, 0], color: 0 }
            ];
            mymesh.v.cvs = [
                { x: 0, y: 0, z: 0 },
            ];
            let zerosArray: number[] = [];
            for (let i = 0; i < vertices.length; i++) {
                zerosArray.push(0);
            }
            let cosX = Math.cos(angleX);
            let sinX = Math.sin(angleX);
            let cosY = Math.cos(angleY);
            let sinY = Math.sin(angleY);
            let cosZ = Math.cos(angleZ);
            let sinZ = Math.sin(angleZ);

            let rotatedVertices = vertices.map((vertex, index) => {
                let x = vertex.x;
                let y = vertex.y;
                let z = vertex.z;
                if (!(index > 5 && index < 9)) {
                    x -= camx
                    y -= camy
                    z -= camz
                }
                // rotate y
                let cosY = Math.cos(angleY);
                let sinY = Math.sin(angleY);
                let rotatedX = x * cosY + z * sinY;
                let rotatedZ = -x * sinY + z * cosY;

                // Rotate x
                let cosX = Math.cos(angleX);
                let sinX = Math.sin(angleX);
                let rotatedZ2 = rotatedZ * cosX - y * sinX;
                let rotatedY2 = rotatedZ * sinX + y * cosX;

                // Rotate z
                let cosZ = Math.cos(angleZ);
                let sinZ = Math.sin(angleZ);
                let rotatedX2 = rotatedX * cosZ - rotatedY2 * sinZ;
                let rotatedY3 = rotatedX * sinZ + rotatedY2 * cosZ;

                // perspective
                let scaleFactor = 150 / (150 + rotatedZ2);
                let projectedX = rotatedX2 * scaleFactor;
                let projectedY = rotatedY2 * scaleFactor;

                // screen coordinates
                let screenX = centerX + projectedX;
                let screenY = centerY + projectedY;

                if (rotatedZ2 > -100) {

                } else {
                    zerosArray[index] = 1
                }
                return { x: screenX, y: screenY, z: rotatedZ2 };
            });

            function quicksort(arr: any[], low: number, high: number, rotatedVertices: any[]) {
                if (low < high) {
                    let pivotIndex = choosePivot(arr, low, high, rotatedVertices);
                    let partitionIndex = partition(arr, low, high, rotatedVertices, pivotIndex);

                    quicksort(arr, low, partitionIndex - 1, rotatedVertices);
                    quicksort(arr, partitionIndex + 1, high, rotatedVertices);
                }
            }

            function choosePivot(arr: any[], low: number, high: number, rotatedVertices: any[]): number {
                // Choose the median of three values: low, middle, high
                let middle = Math.floor((low + high) / 2);

                if (averageZ(rotatedVertices, arr[low].indices) > averageZ(rotatedVertices, arr[middle].indices)) {
                    [arr[low], arr[middle]] = [arr[middle], arr[low]];
                }
                if (averageZ(rotatedVertices, arr[low].indices) > averageZ(rotatedVertices, arr[high].indices)) {
                    [arr[low], arr[high]] = [arr[high], arr[low]];
                }
                if (averageZ(rotatedVertices, arr[middle].indices) > averageZ(rotatedVertices, arr[high].indices)) {
                    [arr[middle], arr[high]] = [arr[high], arr[middle]];
                }

                return middle;
            }

            function partition(arr: any[], low: number, high: number, rotatedVertices: any[], pivotIndex: number): number {
                let pivotValue = averageZ(rotatedVertices, arr[pivotIndex].indices);
                let i = low - 1;

                for (let j = low; j <= high; j++) {
                    let currentAverageZ = averageZ(rotatedVertices, arr[j].indices);
                    if (currentAverageZ > pivotValue) {
                        i++;
                        [arr[i], arr[j]] = [arr[j], arr[i]];
                    }
                }

                [arr[i + 1], arr[pivotIndex]] = [arr[pivotIndex], arr[i + 1]];
                return i + 1;
            }

            function averageZ(rotatedVertices: any[], indices: number[]): number {
                return (rotatedVertices[indices[0]].z + rotatedVertices[indices[1]].z + rotatedVertices[indices[2]].z) / 3;
            }

            function quicksort2(triangles: any[], low: number, high: number, rotatedVertices: any[]) {
                while (low < high) {
                    let pi = partition2(triangles, low, high, rotatedVertices);

                    // Optimize the recursion by tail call optimization
                    if (pi - low < high - pi) {
                        quicksort2(triangles, low, pi - 1, rotatedVertices);
                        low = pi + 1;
                    } else {
                        quicksort2(triangles, pi + 1, high, rotatedVertices);
                        high = pi - 1;
                    }
                }
            }

            function partition2(triangles: any[], low: number, high: number, rotatedVertices: any[]) {
                let pivot = calculateAverageZ2(triangles[high], rotatedVertices);
                let i = low;

                for (let j = low; j < high; j++) {
                    if (calculateAverageZ2(triangles[j], rotatedVertices) > pivot) {
                        // Swap triangles[i] and triangles[j]
                        let temp = triangles[i];
                        triangles[i] = triangles[j];
                        triangles[j] = temp;
                        i++;
                    }
                }

                // Swap triangles[i] and triangles[high]
                let temp = triangles[i];
                triangles[i] = triangles[high];
                triangles[high] = temp;

                return i;
            }

            function calculateAverageZ2(triangle: { indices: number[] }, rotatedVertices: { z: number }[]) {
                let z = (rotatedVertices[triangle.indices[0]].z + rotatedVertices[triangle.indices[1]].z + rotatedVertices[triangle.indices[2]].z) / 3;
                return z;
            }

            if (sort === 0) {
                triangles.sort((b, a) => {
                    let zA = (rotatedVertices[a.indices[0]].z + rotatedVertices[a.indices[1]].z + rotatedVertices[a.indices[2]].z) / 3;
                    let zB = (rotatedVertices[b.indices[0]].z + rotatedVertices[b.indices[1]].z + rotatedVertices[b.indices[2]].z) / 3;
                    return zA - zB;
                });
            } else if (sort === 1) {
                quicksort(triangles, 0, triangles.length - 1, rotatedVertices);

            } else if (sort === 2) {
                quicksort2(triangles, 0, triangles.length - 1, rotatedVertices);

            }

            for (let i = 0; i < triangles.length; i++) {
                let triangle = triangles[i];
                let indices = triangle.indices;
                let color = triangle.color;
                if (!(zerosArray[indices[0]] === 1)) {
                    if (!(zerosArray[indices[1]] === 1)) {
                        if (!(zerosArray[indices[2]] === 1)) {
                            helpers.imageFillTriangle(bg, rotatedVertices[indices[0]].x, rotatedVertices[indices[0]].y, rotatedVertices[indices[1]].x, rotatedVertices[indices[1]].y, rotatedVertices[indices[2]].x, rotatedVertices[indices[2]].y, color)

                        }
                    }
                }
                //scene.backgroundImage().fillTriangle(rotatedVertices[indices[0]].x, rotatedVertices[indices[0]].y, rotatedVertices[indices[1]].x, rotatedVertices[indices[1]].y, rotatedVertices[indices[2]].x, rotatedVertices[indices[2]].y, color);
            }
            rotatedVertices.length = 0;
            triangles.length = 0;

            console.log(zerosArray)

        }
        updateCube()


    }

    //% blockHidden
    //% blockid=poly_getvertice
    //% block="get vertice x $x y $y z $z" 
    //% weight=70
    export function getvertice(x: number, y: number, z: number): cv {
        return {
            x, y, z,
        };
    }

    //% blockHidden
    //% blockid=poly_gettriangle
    //% block="get triangle indice 1 $i1 indice 2 $i2 indice 3 $i3 color $col"
    //% weight=69
    export function gettriangle(i1: number, i2: number, i3: number, col: number): ct {
        return {
            indices: [i1, i2, i3], color: col
        }
    }

    //% blockid=poly_angle_change
    //% block="change angle $choice by $x"
    //% weight=60
    export function change(choice: Angles, x: number) {
        if (choice === 0) {
            axchange += x
        } else if (choice === 1) {
            aychange += x
        } else if (choice === 2) {
            azchange += x
        }
    }
    //% blockid=poly_camera_change
    //% block="change camera $choice by $x"
    //% weight=59
    export function changecam(choice: Cameras, x: number) {
        if (choice === 0) {
            camx += x
        } else if (choice === 1) {
            camy += x
        } else if (choice === 2) {
            camz += x
        }
    }
    //% blockid=poly_angle_set
    //% block="set $choice to $x"
    //% weight=58
    export function setangle(choice: Angles, x: number) {
        if (choice === 0) {
            axchange = x
        } else if (choice === 1) {
            aychange = x
        } else if (choice === 2) {
            azchange = x
        }
    }
    //% blockid=poly_size
    //% block="set size to $x"
    //% weight=50
    export function setsize(x: number) {
        sizechange = x
    }

    //% blockid=poly_sorttype
    //% block="set sorting method to $method"
    //% weight=49
    export function sortingmethod(method: SortingMethods) {
        if (method === 0) {
            sort = 0
        } else if (method === 1) {
            sort = 1
        } else {
            sort = 2
        }
    }

    //% blockid=poly_angle_x
    //% block="angle x"
    //% weight=40
    export function anglex() {
        return axchange
    }
    //% blockid=poly_angle_y
    //% block="angle y"
    //% weight=39
    export function angley() {
        return aychange
    }
    //% blockid=poly_angle_z
    //% block="angle z"
    //% weight=38
    export function anglez() {
        return azchange
    }

    //% blockid=poly_camera_set
    //% block="set camera position to x: $x y: $y z: $z"
    //% weight=48
    export function setcampos(x: number, y: number, z: number) {
        camx = x
        camy = y
        camz = z
    }

}


