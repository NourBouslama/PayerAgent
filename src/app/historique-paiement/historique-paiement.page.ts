/* eslint-disable @typescript-eslint/prefer-for-of */
import { DataService } from './../services/data.service';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { PaiementService } from '../services/paiement.service';
import { Paiement } from '../model/paiement.model';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-historique-paiement',
  templateUrl: './historique-paiement.page.html',
  styleUrls: ['./historique-paiement.page.scss'],
})
export class HistoriquePaiementPage implements OnInit {
  listePaiement = [];
  listeData = [];
  list = [];
  p = new Paiement();
  constructor(
    private paiementService: PaiementService,
    private toast: ToastController,
    private dataService: DataService,
    public actionSheetController: ActionSheetController,
    public authService: AuthentificationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.listePaiement = this.paiementService.lister();
  }
  transfererPaiement() {
    //  this.listePaiement=this.paiementService.lister();
    console.log(this.listePaiement);

    for (let i = 0; i < this.listePaiement.length; i++) {
      this.p.modePaiement = this.listePaiement[i].mode;
      console.log(this.listePaiement[i].mode);
      this.p.agent = this.listePaiement[i].agent;
      this.p.factures = this.listePaiement[i].factures;
      this.list.push(this.p);
    }
    console.log(this.p);
    this.paiementService.payerFactures(this.list).subscribe((p) => {});
  }
  paiement(){
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
