elevatorid = 1
FloorRequestButtonid =1
CallButtonid = 1

class FloorRequestButton {
    constructor (FloorRequestButtonid,status,floor){
        this.FloorRequestButtonid = FloorRequestButtonid;
        this.status = status;
        this.floor = floor;

    }


}
class Callbutton{
    constructor(CallButtonid, status,ButtonFloor, direction){
    this.CallButtonid = CallButtonid;
    this.status = status;
    this.ButtonFloor = ButtonFloor;
    this.direction = direction;

    }



}
class Door{
    constructor(id, status){
    this.id = id;
    this.status = status;
}


}

class Elevator {
    constructor (elevatorid, status, direction, AmountOfFloors,currentFloor){
        this.elevatorid = elevatorid;
        this.status = status;
        this.direction = direction
        this.AmountOfFloors = AmountOfFloors;
        this.currentFloor = currentFloor
        this.door = new Door (elevatorid, "closed")
        this.FloorRequestsButtonList = [];
        this.floorRequestList = [];

        this.createFloorRequestButtons(AmountOfFloors)
    }
    createFloorRequestButtons(AmountOfFloors){
        let ButtonFloor =1;
        for (let i = 1; i <= AmountOfFloors;i++){
            const floorrequestbutton = new FloorRequestButton(FloorRequestButtonid,"on",ButtonFloor)
            this.FloorRequestsButtonList.push(floorrequestbutton)
            ButtonFloor ++
            FloorRequestButtonid ++
        }
    }
    requestFloor(floor){
        this.floorRequestList.push(floor)
         this.sortFloorList()
         this.move()
         this.operateDoors()
    }
    operateDoors(){
        this.door.status = "open"
        console.log("Door is Opening")
        this.door.status = "closed"
        console.log("Door is closing")
    }
    
    move(){
                while(this.floorRequestList.length != 0 ){
                    let destination = this.floorRequestList[0]
                    this.status = "moving"
                    if (this.currentFloor < destination){
                        this.direction = "up"
                            while(this.currentFloor < destination){
                                console.log("elevator current floor " + this.currentFloor)
                                this.currentFloor++
                                this.floorRequestList.shift()
                                
                            }
                    }
                    else if  (this.currentFloor > destination){
                        this.direction = "down"
                            while (this.currentFloor > destination){
                                console.log("elevator current floor " + this.currentFloor)
                                this.floorRequestList.shift()
                                this.currentFloor--
                            }
                    }
                }
                
                
                this.status = "stopped"
                this.floorRequestList.shift()
                console.log("elevator is stopped on floor" + this.currentFloor)
                
            }
    sortFloorList(){
                    if (this.direction = "up"){
                        this.floorRequestList.sort()
                    }
                    else{
                        this.floorRequestList.sort()
                        this.floorRequestList.reverse()
                    }
    }           
    
}




class Column {
    constructor (id, status, AmountOfFloors, AmountOfElevators){
        this.id = id; 
        this.status = status ;
        this.AmountOfFloors = AmountOfFloors;
        this.AmountOfElevators = AmountOfElevators;
        this.CallButtonList = [];
        this.elevatorList  = [];

        this.createCallbuttons(AmountOfFloors)
        this.createElevator(AmountOfElevators)    
        
    }
   
    
    
    createElevator (AmountOfElevators){
        for (let i = 1; i <=AmountOfElevators; i++ ){
            const elevator = new Elevator(elevatorid, "idle",this.AmountOfFloors,1)
            this.elevatorList.push(elevator);
            elevatorid++;
        }
    }     
    createCallbuttons(AmountOfFloors){
        
        let ButtonFloor = 1;
        

        for (let c = 0 ;c < AmountOfFloors; c++){
            if (ButtonFloor < AmountOfFloors){
                const callbutton = new Callbutton(CallButtonid, "on", ButtonFloor,"up")
                this.CallButtonList.push (callbutton);
                CallButtonid ++;
            }
            if (ButtonFloor > 1){
                const callbutton = new Callbutton(CallButtonid, "on", ButtonFloor, "down")
                this.CallButtonList.push (callbutton);
                CallButtonid ++;
            
                
            }
            ButtonFloor++
        }
    
    }
    requestElevator(requestedFloor, requestedDirection){
        let elevator = this.findBestElevator(requestedFloor,requestedDirection)
        elevator.floorRequestList.push(requestedFloor)
        elevator.sortFloorList()
        elevator.move()
        elevator.operateDoors()
        
    
        return elevator
    }
    findBestElevator(requestedFloor,requestedDirection){
        let bestElevator 
        let bestScore = 5;
        let referenceGap = 1000
        let bestElevatorInformation

        
        for (let i = 0; i < this.elevatorList.length; i++) {
            let elevator = this.elevatorList[i]
        
            if (requestedFloor == elevator.currentFloor && elevator.status == "stopped" && requestedDirection == elevator.direction){
                bestElevatorInformation = this.checkIfElevatorIsBetter(1,elevator,bestScore,referenceGap,bestElevator)
                
            }
            else if (requestedFloor > elevator.currentFloor && elevator.status == "stopped" && requestedDirection == elevator.direction){
                bestElevatorInformation = this.checkIfElevatorIsBetter(2, elevator,bestScore,referenceGap,bestElevator)
        
                
            }
            else if (requestedFloor < elevator.currentFloor && elevator.status == "stopped" && requestedDirection == elevator.direction){
                bestElevatorInformation = this.checkIfElevatorIsBetter(2, elevator,bestScore,referenceGap,bestElevator)
                
            }
            else if (elevator.status == "idle"){
                bestElevatorInformation = this.checkIfElevatorIsBetter(3, elevator,bestScore,referenceGap,bestElevator)   
            }
            else {
                bestElevatorInformation = this.checkIfElevatorIsBetter(4, elevator,bestScore,referenceGap,bestElevator)  
            }
            
            bestElevator = bestElevatorInformation.bestElevator
            bestScore = bestElevatorInformation.bestScore
            referenceGap = bestElevatorInformation.referenceGap

        }
        
        return bestElevator;

    }
    checkIfElevatorIsBetter(scoreToCheck,newElevator,bestScore,referenceGap,bestElevator,floor){
        if(scoreToCheck < bestScore){
            bestScore = scoreToCheck;
            bestElevator = newElevator
            referenceGap = Math.abs(newElevator.currentFloor - floor)
        
        }
        else if (scoreToCheck = bestScore){
            let gap = Math.abs(newElevator.currentFloor - floor)
        
            if( referenceGap > gap){
                bestElevator = newElevator
                referenceGap = gap
            }
        }
    
        return {bestElevator, bestScore, referenceGap}


    }

}

//Scenario 1

const col = new Column(1,'On', 10, 2);

console.log("scenario 3")
function scenario1(){

col.elevatorList[0].currentFloor = 2
col.elevatorList[1].currentFloor = 6

let elevator = col.requestElevator(3,"up")
elevator.requestFloor(7)

}
scenario1();
console.log("")
console.log("Scenario 2")
function scenario2(){
    col.elevatorList[0].currentFloor = 10
    col.elevatorList[1].currentFloor = 3
    
    let elevator = col.requestElevator(1, "up")
    elevator.requestFloor(6)
}
scenario2();

//Scenario 3
console.log("")
console.log("Scenario 3")
function scenario3(){
    col.elevatorList[0].currentFloor = 10
    col.elevatorList[1].currentFloor = 3
    col.elevatorList[1].status = "moving"
    col.elevatorList[1].direction = "up"

    let elevator = col.requestElevator(3, "down")
    elevator.requestFloor(6)
}
scenario3();






