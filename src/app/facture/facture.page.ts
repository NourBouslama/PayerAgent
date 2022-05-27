/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable prefer-const */
import { PaiementService } from './../services/paiement.service';
import { DataService } from './../services/data.service';
import { Component, OnInit } from '@angular/core';
import { Facture } from '../model/facture.model';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { PaiementPage } from '../paiement/paiement.page';
import { FactureService } from '../services/facture.service';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { Paiement } from '../model/paiement.model';


@Component({
  selector: 'app-facture',
  templateUrl: './facture.page.html',
  styleUrls: ['./facture.page.scss'],
})
export class FacturePage implements OnInit {
  listData: any ;
  list = [];
  reference: number;
  factlist = [];
  // indexList: any [];
  secteur: string;
  dataReturned: any;
  listeReference: any[];
  selectedReference;
  factures = [];
   agent: any;
   paiement=new Paiement();
  constructor(
    private dataService: DataService,
    public modalController: ModalController,
    private paiementService: PaiementService,
    private factureService: FactureService,
    private router: Router,
    private authentificationService: AuthentificationService,
    public alertController: AlertController,   public actionSheetController: ActionSheetController,  
    public authService: AuthentificationService,
  ) {
    this.listeReference = [
      { label: 'Référence Facture', value: 1, isSelected: false },
      { label: 'Référence Client', value: 2, isSelected: false },
      { label: 'Référence Contrat', value: 3, isSelected: false },
    ];
  }

  ngOnInit() {
    this.chercher();


  }
  async chercher() {
    this.listData = await this.dataService.getData();
let list3=[];
    if(this.listData===null)
    {
      this.addData();
    }
    else{
      for(let i of this.listData)
      {
        if(i.etat=== 'impayé')
        {
list3.push(i);
        }
      }
      this.listData=list3;
    }
     //paiementService.rescue('myFactureListe');



  }
  async addData() {
    const secteur = this.authentificationService.getSecteur();
    this.factureService.chercherParSecteur(secteur).subscribe(async (arg) => {
      this.list = arg;
      console.log(arg);
      for (let i=0; i<arg.length;i++) {
       this.listData= await this.dataService.addData(arg[i]);
        console.log('la liste :' + arg[i]);
        this.listData = await this.dataService.getData();
      }
      window.location.reload();
     // this.listData = await this.dataService.getData();
    });
  //  window.location.reload();
  }


  async ajouterPaiement() {
    this.factlist = this.listData.filter((x) => x.isselected === true);
    let mt=0;
      for(let i=0; i< this.factlist.length; i++)
      {
          mt=mt+ this.factlist[i].montant;
          console.log(i, this.factlist[i].montant);
      }
////
this.paiement.modePaiement='espèce';
this.paiement.etat='payé';

////
    const dataTab = [
        {
          mode: 'espèce',
          date: new Date(),
          etat: 'payé',
          factures: this.factlist,
          totalMontant: mt,
          agent:this.dataService.getAgent()
        },
      ];
      await this.paiementService.addPaiement(dataTab);
      this.modifierFacture();

      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Paiement Effectué',
        subHeader: '',
        message:
          'votre ordre de paiement est effectuée avec succès  <image src="../../assets/icon/success.jpeg"></image></ion-icon> ',
        buttons: ['OK'],//this.router.navigate(['/facture'])
      });
      await alert.present();
      this.router.navigate(['/historique-paiement']).then(()=>{
       // window.location.reload();
      });

    }
//this.closeModal();



 /* async openModal() {
    this.factlist = this.listData.filter((x) => x.isselected === true);

    let indexList = this.factlist.findIndex((x) => x.referenceFact);
    // let index = a.findIndex(x => x.LastName === "Skeet");
    console.log(this.factlist);
    console.log(indexList);
    const modal = await this.modalController.create({
      component: PaiementPage,
      componentProps: {
        //      totalMt: this.mts,
        paramTitle: this.factlist,
        indexList: this.listData,
      },
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data === 'ok') {
        console.log(dataReturned.data);
        this.modifierFacture();
      }
    });

    return await modal.present();
  }*/

  async modifierFacture() {
    for (let i = 0; i < this.listData.length; i++) {
      //  let indexList = this.listData.findIndex((x) => x === this.factlist[i]);
      //await this.dataService.removeData(i);
      for (let j = 0; j < this.factlist.length; j++) {
        if (this.listData[i] === this.factlist[j]) {
          this.listData[i].etat = 'payé';
        }
      }
    }
    await this.dataService.setData(this.listData);
  /*  this.router.navigate(['/facture']).then(()=>{
      window.location.reload();
    });*/

  }

  async chercherfacture() {
    console.log('le référence selectionné', this.selectedReference);
    console.log(this.reference);
    const listchercher = [];
    const list= await this.dataService.getData();
    if (this.selectedReference === '1') {
      for (let i = 0; i < list.length; i++) {

        if (list[i].referenceFact === this.reference && list[i].etat!== 'payé') {
          listchercher.push(list[i]);
        }
      }
    } else if (this.selectedReference === '2') {
      for (let i = 0; i < list.length; i++) {

        if (list[i].client.referenceClient === this.reference && list[i].etat!== 'payé') {
          listchercher.push(list[i]);
        }
      }
    } else if (this.selectedReference === '3') {
      for (let i = 0; i < list.length; i++) {

        if (list[i].contrat.referenceContrat === this.reference && list[i].etat!== 'payé') {
          listchercher.push(list[i]);
        }
      }
    }
    console.log('la liste: ', listchercher);
    this.listData = listchercher;
  }

  paiements(){
    this.router.navigateByUrl('/facture');
  }
  historique(){
    this.router.navigateByUrl('/historique-paiement');
  }
  
  acceuil(){
    this.router.navigateByUrl('/folder/:id');
  
  
  }
  
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'A propos',
  
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Modifier profil',
          icon: 'person-add-outline',
          data: 5,
          handler: () => {
            this.router.navigateByUrl('/modifier-profile');
          }
        },
        {
        text: 'Deconnexion',
        icon: 'log-out-outline',
        data: 5,
        handler: () => {
          this.authService.logout();
          this.paiementService.deleteAll();
          this.router.navigateByUrl('/authentification');
        },
  
      },
  
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  
    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }
}
