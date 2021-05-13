import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapPolyline, MapRectangle } from '@angular/google-maps';

@Component({
  selector: 'app-map2',
  templateUrl: './map2.page.html',
  styleUrls: ['./map2.page.scss'],
})
export class Map2Page implements OnInit {

  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapPolyline, { static: false }) polyline: MapPolyline;
  @ViewChild(MapRectangle, { static: false }) rect: MapRectangle;

  mapZoom: number = 17;
  mapCenter: google.maps.LatLngLiteral = {
    lat: 38.9053623,
    lng: -121.0841413
  };
  // mapCenter: google.maps.LatLngLiteral = {
  //   lat: 24,
  //   lng: 12
  // };
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 50,
    minZoom: 1
  };

  polylineOptions: google.maps.PolylineOptions = {
    editable: true
  };

  rectangleOptions: google.maps.RectangleOptions = {
    editable: true
  };

  vertices: google.maps.LatLngLiteral[] = [];

  deleteMenu = new DeleteMenu();
  bounds: google.maps.LatLngBoundsLiteral = {
    east: 10,
    north: 10,
    south: -10,
    west: -10,
  };


  constructor() { }

  ngOnInit(): void {
    this.vertices.push({ lat: 38.9053623, lng: -121.084146664418 });
    this.vertices.push({ lat: 38.9048489510138, lng: -121.083925536246 });
    this.vertices.push({ lat: 38.9042221352934, lng: -121.083657357112 });
  }

  ionViewDidEnter() {
    this.rect.boundsChanged.subscribe(event => {
      console.log(event);
    });

    const path = this.polyline.getPath();
    const self = this;
    google.maps.event.addListener(path, 'insert_at', function (event) {
      console.log(event);
      self.updatePolylinePath();
    });
    google.maps.event.addListener(path, 'remove_at', function (event) {
      console.log(event);
      self.updatePolylinePath();
    });
    google.maps.event.addListener(path, 'set_at', function (event) {
      console.log(event);
      self.updatePolylinePath();
    });

    // this.polyline.polylineClick.subscribe(event=>{
    //   console.log(event);
    // });

    // this.polyline.polylineDragstart.subscribe(event => {
    //   console.log(event);
    // });

    // this.polyline.polylineMousedown.subscribe((event: google.maps.PolyMouseEvent) => {
    //   console.log(event);
    //   if (!event.vertex) return;
    //   const path = this.polyline.getPath();
    //   console.log(path);
    //   google.maps.event.addListenerOnce(path, 'set_at', function (vertex) {
    //     this.setAt(vertex, event.latLng);
    //   });
    // });

    // this.polyline.polylineMouseup.subscribe(event => {
    //   console.log(event)
    // });

  }

  private updatePolylinePath() {
    const path = this.polyline.getPath();

    path.forEach((point, i) => {
      console.log('%f, %f', path.getAt(i).lat(), path.getAt(i).lng());      
    });
  }

  async onMapClicked(event: google.maps.MapMouseEvent) {
    if (!this.polyline) return;
    //const path = this.polyline.getPath();
    //path.push(event.latLng);
    //this.vertices.push(event.latLng.toJSON());
  }

  async onMarkerClicked(event: any) {
    console.log(event);
    if (!this.polyline) return;
    const path = this.polyline.getPath();
    path.removeAt(event.vertex);
  }

  async onPolylineClick(event: google.maps.PolyMouseEvent) {
    console.log(event);
  }

  async onPolylineRightclick(event: any) {
    console.log(event);
    if (event.vertex === undefined) return;
    this.deleteMenu.open(this.map.googleMap, this.polyline.getPath(), event.vertex);
  }

  async onPolylineDblclick(event: google.maps.PolyMouseEvent) {
    console.log(event);
    // if (event.vertex !== undefined) {
    //   console.log(event.vertex);
    // }
  }

  async onPolylineDragend(event: google.maps.MapMouseEvent) {
    console.log(event);
    // if (event.vertex !== undefined) {
    //   console.log(event.vertex);
    // }
  }

  async onPolylineDrag(event: google.maps.MapMouseEvent) {
    console.log(event);
    // if (event.vertex !== undefined) {
    //   console.log(event.vertex);
    // }
  }

  async onPolylineDragstart(event: google.maps.MapMouseEvent) {
    console.log(event);
    // if (event.vertex !== undefined) {
    //   console.log(event.vertex);
    // }
  }

}

class DeleteMenu extends google.maps.OverlayView {
  private div_: HTMLDivElement;
  private divListener_?: google.maps.MapsEventListener;

  constructor() {
    super();
    this.div_ = document.createElement("div");
    this.div_.className = "delete-menu";
    this.div_.innerHTML = "Delete";

    const menu = this;
    google.maps.event.addDomListener(this.div_, "click", () => {
      menu.removeVertex();
    });
  }

  onAdd() {
    const deleteMenu = this;
    const map = this.getMap() as google.maps.Map;
    this.getPanes()!.floatPane.appendChild(this.div_);

    // mousedown anywhere on the map except on the menu div will close the
    // menu.
    this.divListener_ = google.maps.event.addDomListener(
      map.getDiv(),
      "mousedown",
      (e: Event) => {
        if (e.target != deleteMenu.div_) {
          deleteMenu.close();
        }
      },
      true
    );
  }

  onRemove() {
    if (this.divListener_) {
      google.maps.event.removeListener(this.divListener_);
    }

    (this.div_.parentNode as HTMLElement).removeChild(this.div_);

    // clean up
    this.set("position", null);
    this.set("path", null);
    this.set("vertex", null);
  }

  close() {
    this.setMap(null);
  }

  draw() {
    const position = this.get("position");
    const projection = this.getProjection();

    if (!position || !projection) {
      return;
    }

    const point = projection.fromLatLngToDivPixel(position)!;
    this.div_.style.top = point.y + "px";
    this.div_.style.left = point.x + "px";
  }

  /**
   * Opens the menu at a vertex of a given path.
   */
  open(
    map: google.maps.Map,
    path: google.maps.MVCArray<google.maps.LatLng>,
    vertex: number
  ) {
    this.set("position", path.getAt(vertex));
    this.set("path", path);
    this.set("vertex", vertex);
    this.setMap(map);
    this.draw();
  }

  /**
   * Deletes the vertex from the path.
   */
  removeVertex() {
    const path = this.get("path");
    const vertex = this.get("vertex");

    if (!path || vertex == undefined) {
      this.close();
      return;
    }

    path.removeAt(vertex);
    this.close();
  }
}

