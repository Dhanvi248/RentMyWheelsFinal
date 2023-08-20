import { LightningElement,wire,api} from 'lwc';
import getCarList from '@salesforce/apex/CarController.getCarList';
import { publish, MessageContext } from 'lightning/messageService';
import SELECTED_Car from '@salesforce/messageChannel/SelectedCar__c';

export default class LocationSearchResult extends LightningElement {
    carName='';  
    carData;//data we get from soql
    selectedCarId;
    @wire(getCarList,{Car:'$carName'})
    wiredCar({data,error}){
        if(error){
            console.error(error);
        }
        else if(data){ 
            this.carData = data;
            console.log('this.carData:'+JSON.stringify(this.carData))// we get all data of pg
        }
    } 

    @wire(MessageContext)
    messageContext;
   
    handleClickPlayerCard(event){
        this.selectedcarId = event.currentTarget.dataset.id;
        console.log('this.selectedcarId:'+JSON.stringify(this.selectedcarId));
        

        //To Remove from previous one 
        let boxClass = this.template.querySelectorAll('.selected');
        if(boxClass.length >0){
            this.removeClass();
        }
        //current selected
        let carBox = this.template.querySelector(`[data-id="${this.selectedcarId}"]`)
        if(carBox){
            carBox.className= 'title_wrapper selected'
        }
        //Data is published
        publish( this.messageContext, SELECTED_Car, { CarId : this.selectedcarId});

        this.dispatchEvent(new CustomEvent('select',{
            detail:{
                CarId : this.selectedcarId
            }
        }))

    }
    removeClass(){
        this.template.querySelectorAll('.selected')[0].classList.remove('selected');
    }   
}
    