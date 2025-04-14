import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Server } from '../../../../common/interfaces/server';
import { RcBackendService } from '../../../../services/rc-backend.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RcButtonComponent } from '../../../../components/rc-button/rc-button.component';
import { SbiAutocompleteComponent, SbiDropdownComponent, SbiInputComponent, SbiSnackBarService, SbiSuggestChipComponent } from '@sbi/design-system';
import { take } from 'rxjs';
import { EditorComponent, EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { Item } from '../../../../common/interfaces/filter';
import { SbiDividerComponent } from "../../../../../../projects/lib.sbi-design-system/lib/src/components/sbi-divider/sbi-divider.component";
import { BannerComponent } from './banner/banner.component';
import { ImagesComponent } from './images/images.component';

export interface ServerForm {
  name: FormControl<string | null>;
  slogan: FormControl<string | null>;
  banner: FormControl<string | null>;
  address: FormControl<string | null>;
  port: FormControl<number | null>;
  description: FormControl<string | null>;
  version: FormControl<Item | null>;
  site: FormControl<string | null>;
  vk: FormControl<string | null>;
  discord: FormControl<string | null>;
  videoUrl: FormControl<string | null>;
  launcher: FormControl<string | null>;
  screenshots: FormControl<string[] | null>;
  borderColor: FormControl<string | null>;
  bases: FormControl<Item[] | null>;
  mods: FormControl<Item[] | null>;
  plugins: FormControl<Item[] | null>;
  miniGames: FormControl<Item[] | null>;
}

@Component({
  selector: 'rc-edit-server',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RcButtonComponent,
    SbiInputComponent,
    SbiAutocompleteComponent,
    SbiDropdownComponent,
    SbiDividerComponent,
    EditorComponent,
    EditorModule,
    BannerComponent,
    ImagesComponent
  ],
  providers: [SbiSnackBarService, { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }],
  templateUrl: './edit-server.component.html',
  styleUrl: './edit-server.component.scss'
})
export class EditServerComponent implements OnInit {
  rcBackend = inject(RcBackendService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  snackbarService = inject(SbiSnackBarService);
  serverId: string | null = '';
  bases: any = this.rcBackend.bases;
  miniGames: any = this.rcBackend.miniGames;
  mods: any = this.rcBackend.mods;
  plugins: any = this.rcBackend.plugins;
  versions: any = [];
  serverForm!: FormGroup<ServerForm>;

  init: EditorComponent['init'] = {
    plugins: 'autolink emoticons insertdatetime link lists',
    base_url: '/tinymce',
    suffix: '.min',
    toolbar: "undo redo | bold italic underline | formatpainter | aligncenter alignleft alignright alignjustify | ltr rtl | emoticons | numlist bullist",
    skin: 'oxide-dark',
    content_css: "dark"
  };

  ngOnInit() {
    this.rcBackend.loadBases().pipe(take(1)).subscribe();
    this.rcBackend.loadMiniGames().pipe(take(1)).subscribe();
    this.rcBackend.loadMods().pipe(take(1)).subscribe();
    this.rcBackend.loadPlugins().pipe(take(1)).subscribe();
    this.rcBackend.loadVersions().pipe(take(1)).subscribe(versions => {
      this.versions = versions.map((version: any) => ({value: version, viewValue: version.value}));
    });

    this.serverId = this.route.snapshot.paramMap.get('id');

    if (this.serverId) {
      this.rcBackend.getServerById(this.serverId).subscribe({
        next: (server) => {
          this.initializeForm(server)
        },
        error: (error) => {
          console.error('Ошибка при загрузке сервера:', error);
          this.router.navigate(['/user/my-servers']);
        }
      });
    } else {
      console.error('ID сервера не передан');
      this.router.navigate(['/user/my-servers']);
    }
  }

  initializeForm(server: Server): void {
    this.serverForm = new FormGroup({
      name: new FormControl(server.name, Validators.required),
      slogan: new FormControl(server.slogan),
      banner: new FormControl(server.banner),
      address: new FormControl(server.address, Validators.required),
      port: new FormControl(server.port ?? 25565, [
        Validators.required,
        Validators.min(1),
        Validators.max(65535)
      ]),
      description: new FormControl(server.description),
      version: new FormControl(server.version),
      site: new FormControl(server.site),
      vk: new FormControl(server.vk),
      discord: new FormControl(server.discord),
      videoUrl: new FormControl(server.videoUrl),
      launcher: new FormControl(server.launcher),
      screenshots: new FormControl(server.screenshots), // Массив строк
      borderColor: new FormControl(server.borderColor),
      bases: new FormControl(server.bases ?? []), // Массив объектов Item
      mods: new FormControl(server.mods ?? []), // Массив объектов Item
      plugins: new FormControl(server.plugins ?? []), // Массив объектов Item
      miniGames: new FormControl(server.miniGames ?? []) // Массив объектов Item
    });
  }

  getControl(name: string) {
    return this.serverForm && this.serverForm.get(name) as FormControl;
  }

  cancel() {
    this.router.navigate(['/user/my-servers']);
  }

  onSubmit(): void {
    if (this.serverForm.valid) {
      const updatedServer: any = this.serverForm.value;
      // Отправляем данные на сервер
      this.rcBackend.updateServer({...updatedServer, id: this.serverId}).pipe(take(1)).subscribe({
        next: () => {
          this.snackbarService.openSnackBar({
            contentText: `Информация по серверу успешно обновлена`,
            appearance: 'success',
          });
          this.router.navigate(['/user/my-servers']);
        },
        error: (err) => {
          this.snackbarService.openSnackBar({
            contentText: `Ошибка при обновлении сервера: ${err.error.error}`,
            appearance: 'warning',
          });
        }
      });
    }
  }

  updateScreenshots(images: string[]) {
    this.serverForm.controls['screenshots'].setValue(images);
  }

  displayViewValue(val: {id:number, value: string}) {
    return val?.value;
  }
}
