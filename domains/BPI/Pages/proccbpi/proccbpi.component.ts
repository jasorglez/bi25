import { Component, inject } from '@angular/core';
import { TrackingService } from 'app/services/tracking.service';

import { DomainsModule } from 'app/domains/domainsmodule';
import { SetupComponent } from "../../Components/setup/setup.component";
import { LogbookComponent } from '../../Components/logbook/logbook.component';

@Component({
  selector: 'app-proccbpi',
  standalone: true,
  imports: [DomainsModule, SetupComponent, LogbookComponent],
  templateUrl: './proccbpi.component.html',
  styleUrl: './proccbpi.component.scss'
})
export class ProccbpiComponent {

  selectedTab :string = '';

  constructor() {
      this.selectedTab = 'bl' ;
  }

  //inject new way
  private trackingService = inject(TrackingService) ;

  onTabSelected(tabName: string) {
    this.selectedTab = tabName;

    if (tabName === 'conf') {
      this.trackingService.addLog(
         this.trackingService.getnameComp(),
        'Click en la Pestaña Configuraciones',
        'Warehouses',
        this.trackingService.getEmail()
      );
      this.trackingService.setbandform('REQUIS')
    }

    if (tabName === 'contract') {
      this.trackingService.addLog(
        this.trackingService.getnameComp(),
        'Click en la Pestaña Contratos',
        'Warehouses',
        this.trackingService.getEmail()
      );
      this.trackingService.setbandform('OC')
    }

    if (tabName === 'oil') {
      this.trackingService.addLog(
        this.trackingService.getnameComp(),
        'Click en la Pestaña Campos Petroleros',
        'Warehouses',
        this.trackingService.getEmail()
      );
      this.trackingService.setbandformEO('ENT')
    }

    if (tabName === 'proj') {
      this.trackingService.addLog(
        this.trackingService.getnameComp(),
        'Click en la Pestaña Poyectos',
        'Warehouses',
        this.trackingService.getEmail()
      );
      this.trackingService.setbandformEO('OUT')
    }

    if (tabName === 'sec') {
      this.trackingService.addLog(
        this.trackingService.getnameComp(),
        'Click en la Pestaña Seguridad',
        'Warehouses',
        this.trackingService.getEmail()
      );
      this.trackingService.setbandformEO('OUT')
    }
  }


}
