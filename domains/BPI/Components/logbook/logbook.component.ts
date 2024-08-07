import { Component, inject } from '@angular/core';
import { DomainsModule } from 'app/domains/domainsmodule';

import { ChangeDetectorRef } from '@angular/core';

import { ColDef, GridApi, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';

import { ProjectsService } from 'app/services/projects.service';
import { LogbookService } from 'app/services/logbook.service';
import { TrackingService } from 'app/services/tracking.service';
import { Ibooklog } from 'app/interface/ibooklog';
import { Iproject } from 'app/interface/iproject';
import { RowHeightParams } from 'ag-grid-enterprise';


@Component({
  selector: 'app-logbook',
  standalone: true,
  imports: [DomainsModule],
  templateUrl: './logbook.component.html',
  styleUrl: './logbook.component.scss'
})
export class LogbookComponent {

  getRowHeight(params: RowHeightParams): number | undefined {
    // Asume una altura base de 28 píxeles (puedes ajustar este valor)
    const baseHeight = 28;
    
    // Ajusta la altura basada en el contenido de la columna 'description'
    const descriptionContent = params.data.description;
    if (descriptionContent) {
      const lineHeight = 20; // Altura estimada de una línea de texto
      const lineCount = Math.floor(descriptionContent.length / 50) + 1; // Estima el número de líneas
      return Math.max(baseHeight, lineCount * lineHeight);
    }
    
    return baseHeight;
  }
  
    
  private gridApi!: GridApi<Iproject>;
  public project: Iproject[] = [];

  private gridApi2!: GridApi<Ibooklog> ;
  public lb : Ibooklog[] = [] ;

  selectedDate: string = '';

  currentIndex = 0;
  
  id = 0 ;

  selectId   : number = 0 ;


  pri : Number = 0 ;

  Campo    : string  = '';
  Contrato : string  = '';
  Ot       : string  = '';
  descr    : string  = '';

  public rowSelection: 'single' | 'multiple' = 'single';
  public rowGroupPanelShow: 'always' | 'onlyWhenGrouping' | 'never' = 'always';
  public pivotPanelShow: 'always' | 'onlyWhenPivoting' | 'never' = 'always';
  public paginationPageSize = 15;
  public paginationPageSizeSelector: number[] | boolean = [15, 50, 100];
  public defaultColDef: any;
  
  public groupDefaultExpanded = -1;
  public groupDefaultExpanded2 = -1;

  public autoGroupColumnDef: ColDef = {
    headerName: 'Campo PEP',
    field: 'number',  width: 600,  
    cellRenderer: 'agGroupCellRenderer', hide: true,
    cellRendererParams: {

 }
};

public autoGroupColumnDef2: ColDef = {
  headerName: 'Tipo Notas',
  field: 'typeNote',  width: 275,
  cellRenderer: 'agGroupCellRenderer',
  cellRendererParams: {

}
};
 
  selectedRow: Iproject | null = null;

  // Inject of new way for Angular 18
   private trackingService = inject(TrackingService) ;
   
   private projectservice= inject(ProjectsService);
   private lbservice     = inject(LogbookService);
   private cdr           = inject(ChangeDetectorRef);

  // Column Definitions: Defines the columns to be displayed.
   colProject: ColDef[] = [
     {  field: 'number', 
        headerName: 'Campo PEP', 
        width: 600,
        rowGroup: true,
        hide: false },     

     { field: 'company', headerName: 'Compañia', width: 105 }
   ];


   //Bitacora
   colBook: ColDef[] = [
    { field: 'timexnote', headerName: 'Hora', width: 105, filter: true },
    { field: 'description', headerName: 'Comentario', 
        width: 545, wrapText: true, autoHeight: true,
        cellStyle: { 'white-space': 'normal', 'line-height': '20px' } },
    { field: 'typeNote',   headerName: 'Tipo Nota',   width: 385,  rowGroup: true, hide : true },
    { field: 'supervisor', headerName: 'Supervisor', width: 195, filter: true }   
  ];

  
  ngOnInit(): void {
    this.getProjec();
    this.selectedDate = this.formatDate(new Date());
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
    if (this.project && this.project.length > 0) {
      this.gridApi.setGridOption('rowData',this.project);
    }
  }


  onGridReady2(params: GridReadyEvent): void {
    this.gridApi2 = params.api;
    if (this.lb && this.lb.length > 0) {
      this.gridApi2.setGridOption('rowData', this.lb);
    }
  }

  onSelectionChanged(event: SelectionChangedEvent): void {
    const selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length > 0) {
      this.selectId  = selectedRows[0].id;
      this.Campo     = selectedRows[0].campo ?? '';
      this.id        = selectedRows[0].idConsecutivo;
      this.pri       = selectedRows[0].priority  ;
      this.Contrato  = selectedRows[0].contrato ?? '';
      this.Ot        = selectedRows[0].number ?? '';
      this.descr     = selectedRows[0].description ?? '' ;

       //alert(this.id)
       this.getlbxDate(this.selectedDate);
    }
  }

  onSelectionChanged2(event: SelectionChangedEvent): void {
    const selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length > 0) {
      //this.SelectIdlb  = selectedRows[0].id;
      this.Campo     = selectedRows[0].campo ?? '';
    }
  }

  getProjec(): void {
    const project = localStorage.getItem('project');
  
    // Verificamos que company y project no sean null antes de llamarlo
    if (project) {
      this.projectservice.getProject(1, project).subscribe(
        (resp: any) => {
          this.project = this.mapProject(resp);
          
        },
        (error) => {
          console.error('Error fetching Project', error);
        }
      );
    } else {
      console.error('Company or Project is missing in localStorage');
    }
  }


  async getlbxDate(dater: string) {
    const project = localStorage.getItem('project');  
   
      this.lbservice.getLB(dater,  this.id).subscribe(
        (resp: any) => {
          this.lb = this.mapLb(resp);
          if (this.gridApi2) {
            this.gridApi2.setGridOption('rowData', this.lb);
            this.gridApi2.resetRowHeights();
          }
          this.cdr.detectChanges();
         
        },
        (error) => {
          console.error('Error fetching Logbook', error);
        }
      );
  }

  mapLb(data: any[]): Ibooklog[] {
    return data.map(w => ({

      date        : w.date,
      typeNote    : w.typeNote,
      timexnote   : w.timexnote,
      description : w.description,
      supervisor  : w.supervisor      
    } as Ibooklog));
  }


  
  mapProject(data: any[]): Iproject[] {
    return data.map(w => ({
      id          : w.id,
      idConsecutivo : w.idConsecutivo,
      campo       : w.campo,
      number      : w. number,
      priority    : w.priority,
      contrato    : w.contrato,
      description : w.description,
      company     : w.company
      
    } as Iproject));
  }

onDateChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedDate = inputElement.value;
    
    // Convertir la cadena a un objeto Date
    const dateObject = new Date(selectedDate);

    // Formatear la fecha a 'yyyy-MM-dd'
    const formattedDate = dateObject.toISOString().split('T')[0];

    // Actualizar la fecha en el componente
    this.selectedDate = formattedDate;

    // Llamar al método con la fecha formateada
    this.getlbxDate(this.selectedDate);
  }

}



