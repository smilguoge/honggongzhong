<template>
  <div>
    <div class="maps_box">
      <div id="orderMap" class="maps"></div>
      <div class="content">
        <div class="box_1">
          <img src="../../img/xr.png" alt />
          <p>
            {{total_minute}}分钟
            <span style="margin-left:15px">{{mileage}}公里</span>
            <span class="price">¥{{money}}</span>
          </p>
        </div>
        <div class="box_2">
          <p>{{order_address}}</p>
        </div>
        <div class="box_3">
          <p>{{order_destination_address}}</p>
          <div class="link">
            <router-link to="/evaluate">评价</router-link>
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  mounted() {
    // this.getTrajectory();
    this.tracker();
  },
  data() {
    return {
      total_minute:'',
      order_address:'',
      order_destination_address:'',
      mileage:'',
      money:'',
      map: "",
      openid:this.$store.state.openid,
      platform:'official_accounts',
      // access_token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuYnpmZnMuY2NcL2FwaVwvYXV0aFwvcXVpY2tfbG9naW4iLCJpYXQiOjE1NzIzMTYwOTksImV4cCI6MTU3MzUyNTY5OSwibmJmIjoxNTcyMzE2MDk5LCJqdGkiOiJVbmN4Wm9oMnlLaEFPRkRjIiwic3ViIjoyNzkwMDgsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.cCuBhRBzNobvUiXv6Y-eZTEkpayPdnO8zgkBDKyu3Jo',
      orderId:'201910121658196504',
      resData: {
        markers: [
          {
            lng: 108.964001,
            nodeMapType: 9,
            lat: 34.216434
          },
          {
            lng: 109.08465929,
            nodeId: 755380,
            lat: 34.38123567
          },
          {
            lng: 116.54498265,
            nodeMapType: 2,
            lat: 39.7201
          },
          {
            lng: 116.463699,
            nodeMapType: 4,
            lat: 39.79755
          },
          {
            lng: 116.506186,
            nodeMapType: 8,
            lat: 39.792657
          }
        ],
        path: [
          // {lat: 39.864809, lng: 116.377689},
          // { lat: 39.864729, lng: 116.377749 },
          // { lat: 39.864699, lng: 116.377779 },
          // { lat: 39.864529, lng: 116.377899 },
          // { lat: 39.864349, lng: 116.378169 },
          // { lat: 39.864305, lng: 116.378234 },
          // { lat: 39.864728, lng: 116.378727 },
          // { lat: 39.864758, lng: 116.378706 },
          // { lat: 39.864758, lng: 116.378706 },
          // { lat: 39.864902, lng: 116.37893 },
         
        ]
      },
      markersNew: [], //markers 经纬度点的集合
      pathNew: [] //新的轨迹集合
    };
  },
  methods: {
    init() {
      let myOptions = {
        draggable: true,
        scrollwheel: true,
        zoom: 13,
        center: new qq.maps.LatLng(39.916527, 116.397128),
        zoomControl: false //去掉缩放的控件
      };
      let map = new qq.maps.Map(document.getElementById("orderMap"), myOptions);
      this.map = map;
      this.getMarker(this.resData.markers);
      this.getPloyLine(this.resData.path);
    },
    getMarker(markers) {
      //画marker
      let { map } = this;
      let markersNew = [];
      markers.map((item, index) => {
        markersNew.push(new qq.maps.LatLng(item.lat, item.lng));
        let marker = new qq.maps.Marker({
          position: new qq.maps.LatLng(item.lat, item.lng),
          map: map
        });
        this.getImg(item.nodeMapType, marker);
      });
      this.markersNew = markersNew;
    },
    getPloyLine(path) {
      let { map } = this;
      let pathNew = [];
      path.map(item => {
        pathNew.push(new qq.maps.LatLng(item.lat, item.lng));
      });
      // console.log("pathNew", pathNew);
      let polyline = new qq.maps.Polyline({
        path: pathNew,
        strokeColor: "#F0250F",
        strokeWeight: 10,
        map: map
      });
      this.pathNew = pathNew;
      this.getBounds(pathNew);
      this.addArrowMarkers(polyline);
      // this.getMarker(pathNew);
    },
    getBounds(pathNew) {
      //自适应视野
      //根据地图上的几个点 找最大最小视角
      // console.log("pathNew", pathNew);
      let maxPointLat = pathNew[pathNew.length - 1].lat,
        maxPointLng = pathNew[pathNew.length - 1].lng,
        minPointLat = pathNew[0].lat -0.05,
        minPointLng = pathNew[0].lng -0.05;
      const sw = new qq.maps.LatLng(minPointLat, minPointLng); //西南角坐标
      const ne = new qq.maps.LatLng(maxPointLat, maxPointLng); //东北角坐标
      this.map.fitBounds(new qq.maps.LatLngBounds(sw, ne));
    },
    getImg(nodeMapType, marker) {
      // console.log("nodeMapType", nodeMapType);
      let size_recv = new qq.maps.Size(120, 48),
        size_dispatching = new qq.maps.Size(100, 48),
        anchor = new qq.maps.Point(25, 25),
        origin = new qq.maps.Point(0, 0);
      switch (nodeMapType) {
        case 1: //收件
          marker.setIcon(
            new qq.maps.MarkerImage(
              "https://m.360buyimg.com/marketingminiapp/jfs/t1/36809/22/7052/17174/5cc68c1eE3762584d/cf839aa4074ac94b.png",
              size_recv,
              origin,
              anchor,
              size_recv
            )
          );
        case 2: //寄件
          marker.setIcon(
            new qq.maps.MarkerImage(
              "https://m.360buyimg.com/marketingminiapp/jfs/t1/34554/31/7112/15926/5cc68bf6Ea2ab79d4/7e7e6ef40adde335.png",
              size_recv,
              origin,
              anchor,
              size_recv
            )
          );
          break;
        case 3: //配送点
          marker.setIcon(
            new qq.maps.MarkerImage(
              "https://m.360buyimg.com/marketingminiapp/jfs/t1/37029/30/5534/16063/5cc68c35Ee1b42b40/1ab59a5db394f13e.png",
              size_dispatching,
              origin,
              anchor,
              size_dispatching
            )
          );
          break;
        case 4: //分拣中心
          marker.setIcon(
            new qq.maps.MarkerImage(
              "https://m.360buyimg.com/marketingminiapp/jfs/t1/42519/5/1476/16872/5cc68c4fE525a68c6/c4df52c658bfa5b8.png",
              size_recv,
              origin,
              anchor,
              size_recv
            )
          );
          break;
        case 5:
          marker.setIcon(
            new qq.maps.MarkerImage(
              "https://m.360buyimg.com/marketingminiapp/jfs/t1/36809/22/7052/17174/5cc68c1eE3762584d/cf839aa4074ac94b.png",
              size_recv,
              origin,
              anchor,
              size_recv
            )
          );
          break;
        case 6:
          marker.setIcon(
            new qq.maps.MarkerImage(
              "https://m.360buyimg.com/marketingminiapp/jfs/t1/34554/31/7112/15926/5cc68bf6Ea2ab79d4/7e7e6ef40adde335.png",
              size_recv,
              origin,
              anchor,
              size_recv
            )
          );
          break;
        case 7:
          marker.setIcon(
            new qq.maps.MarkerImage(
              "https://m.360buyimg.com/marketingminiapp/jfs/t1/37029/30/5534/16063/5cc68c35Ee1b42b40/1ab59a5db394f13e.png",
              size_dispatching,
              origin,
              anchor,
              size_dispatching
            )
          );
          break;
        case 8:
          marker.setIcon(
            new qq.maps.MarkerImage(
              "https://m.360buyimg.com/marketingminiapp/jfs/t1/42519/5/1476/16872/5cc68c4fE525a68c6/c4df52c658bfa5b8.png",
              size_recv,
              origin,
              anchor,
              size_recv
            )
          );
          break;
        case 9:
          marker.setIcon(
            new qq.maps.MarkerImage(
              "https://m.360buyimg.com/marketingminiapp/jfs/t1/42519/5/1476/16872/5cc68c4fE525a68c6/c4df52c658bfa5b8.png",
              size_recv,
              origin,
              anchor,
              size_recv
            )
          );
          break;
        case "arrow":
          marker.setIcon(
            new qq.maps.MarkerImage(
              "https://m.360buyimg.com/marketingminiapp/jfs/t1/40149/9/3953/377/5cc6ccd8E67283281/3c40b6c42b49c086.png",
              new qq.maps.Size(9, 8),
              undefined,
              new qq.maps.Point(5, 4),
              new qq.maps.Size(9, 8)
            )
          );
          break;
      }
    },
    /**
     * 画箭头
     */
    // addMarkers(lat, lng, opts) {
    //   var position = new qq.maps.LatLng(lat, lng);
    //   var defaultOps = {
    //     map: this.map, //mapInstance为对应的qq map实例
    //     position,
    //     visible: true
    //   };
    //   var options = Object.assign({}, defaultOps, opts || {});
    //   var marker = new qq.maps.Marker(options);
    //   this.getImg("arrow", marker);
    //   return marker;
    // },
    computeRotaion(heading) {
      let rotation;
      if (0 < heading <= 90) {
        rotation = 270 + heading;
      } else if (90 < heading <= 180) {
        rotation = heading - 90;
      } else if (-90 < heading <= 0) {
        rotation = 90 - heading;
      } else if (-180 < heading <= -90) {
        rotation = 270 + heading;
      }
      return rotation;
    },
    addArrowMarkers(polyline) {
      //添加方向marker
      var defaultOps = {
        cursor: "normal",
        zIndex: polyline.getZIndex() + 1,
        clickable: false,
        draggable: false
      };

      var linePoint = polyline.getPath(); //线的经纬度坐标
      var arrowCount = linePoint.length;
      for (let i = 1; i < arrowCount; i++) {
        //不是每两个点之间都画箭头，而是每隔一个间隔画一个箭头
        let pixelStart = linePoint.getAt(i - 1);
        let pixelEnd = linePoint.getAt(i);
        let heading, rotation, arrowLatLng, marker;
        let spherical = qq.maps.geometry.spherical;
        let distance = spherical.computeDistanceBetween(pixelStart, pixelEnd); //计算两经纬度坐标件的距离

        if (distance <= 15) {
          //距离太近小于15m的两经纬度坐标点间不画方向
          continue;
        }
        // 返回从一个坐标到另一个坐标的航向。航向是指从一个坐标指向另一个坐标的向量与正北方向的夹角，范围为[-180,180)。
        heading = spherical.computeHeading(pixelStart, pixelEnd); //两经纬度坐标点之间的航向
        // console.log("heading", heading);
        arrowLatLng = spherical.computeOffsetOrigin(
          pixelEnd,
          distance / 2,
          heading
        ); //通过终点坐标、距离以及航向算出起始点坐标。

        // marker = this.addMarkers(arrowLatLng.lat, arrowLatLng.lng, defaultOps);
        rotation = this.computeRotaion(heading); //由两坐标点之间的航向计算marker要旋转的角度
        // console.log("rotation", rotation);
        // marker.setRotation(rotation); //设置marker角度  rotation属性取值范围0-360,支持IE9及以上版本
      }
    },
    getTrajectory(){
      this.$axios.post('/api/auth/quick_login',{
        platform:this.platform,
        openid:this.openid,
      }).then(res =>{
        console.log(res)
        if(res.code == 200){
          let data = res.data;
          this.$store.commit('set_token', 'bearer ' + data.access_token);
          this.access_token = res.data.access_token
          this.$router.go(0)
        }
      })
    },
    tracker(){
      let id  = this.$route.query.order_id;
      this.$axios.get('/api/order/tracker',{
            id:this.orderId
            // token:this.access_token
            }).then(res =>{
              console.log(res)
              var i= ''
              var number = res.data.points.length;
              let lineheji=[];
              for(var i = 0; i<number; i++) {
                var lineObj ={}
 　　           var line = res.data.points[i].location
                var linelng =line.match(/(\S*),/)[0]
                var linelng1 = linelng.substring(0,linelng.length-1)
                var linelat = line.match(/,(\S*)/)[0]
                var linelat1 =linelat.substr(1);
                lineObj.lat = linelat1;
                lineObj.lng = linelng1;
                lineheji.push(lineObj)
              }
              this.resData.path = lineheji
              // console.log(lineheji)
              // console.log(this.resData.path)
              this.init();
              this.orderDetail();
          })
    },
    orderDetail(){
      let id  = this.$route.query.order_id;
      this.$axios.get('/api/order/detail',{
        id:this.orderId
      })
      .then(res=>{
        console.log(res)
        this.order_address = res.data.order_address
        this.order_destination_address =  res.data.order_destination_address
        this.money = res.data.money
        this.mileage =res.data.mileage
        this.total_minute =res.data.total_minute
      })
    },
    getCodeApi(state) {
      //获取code
      let urlNow = encodeURIComponent(window.location.href);
      let scope = "snsapi_userinfo"; //snsapi_userinfo   //静默授权 用户无感知
      let appid = "wxfa06eb7ecfcc9197";
      let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${urlNow}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
      window.location.replace(url);
    },
    getUrlKey(name) {
      //获取url 参数
      return (
        decodeURIComponent(
          (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
            location.href
          ) || [, ""])[1].replace(/\+/g, "%20")
        ) || null
      );
    }
  },
  created() {
   
    //返回值
    let code = this.getUrlKey("code");
    if (code) {
      this.$axios
        .post("/api/auth/wechatinfo?code=" + code)
        .then(res => {
          console.log(res);
          if(res.code == 200){
            this.openid = res.data.original.openid;
            this.getTrajectory();
          }
        });
    } else {
      this.getCodeApi("123");
    }
  }
};
</script>
<style lang="less" scoped>
.maps_box {
  width: 100vw;
  height: 100vh;
  position: relative;
  .maps {
    width: 100vw;
    height: 100vh;
  }
}
.content {
  position: fixed;
  bottom: 20px;
  width: 90vw;
  left: 5vw;
  height: 320px;
  background-color: #fff;
  z-index: 999999;
  border-radius: 15px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  .box_1 {
    width: 100%;
    height: 115px;
    border-bottom: 1px solid #d5d5d5;
    line-height: 115px;
    font-size: 28px;
    float: left;
    img {
      width: 40px;
      height: 40px;
      float: left;
      margin-left: 25px;
      margin-top: 35px;
    }
    p {
      width: 80%;
      float: left;
      margin-left: 20px;
      text-align: left;
      font-weight: 700;
      letter-spacing: 1px;
      .price {
        color: #ff596a;
        font-size: 48px;
        float: right;
      }
    }
  }
  .box_2 {
    width: 100%;
    height: 100px;
    overflow: hidden;
    p {
      width: 80%;
      text-align: left;
      margin-left: 85px;
      font-size: 32px;
      line-height: 100px;
      border-bottom: 1px solid #d5d5d5;
      position: relative;
      &:before {
        content: "";
        position: absolute;
        width: 15px;
        height: 15px;
        border-radius: 100%;
        background-color: #44bfa3;
        left: -45px;
        top: 40px;
      }
    }
  }
  .box_3 {
    width: 100%;
    height: 100px;
    overflow: hidden;
    p {
      width: 60%;
      text-align: left;
      margin-left: 85px;
      font-size: 32px;
      line-height: 100px;
      position: relative;
      float: left;
      &:before {
        content: "";
        position: absolute;
        width: 15px;
        height: 15px;
        border-radius: 100%;
        background-color: #fe5252;
        left: -45px;
        top: 40px;
      }
    }
    .link {
      width: 133px;
      height: 50px;
      text-align: center;
      float: left;
      line-height: 50px;
      background-color: #ff596a;
      border-radius: 10px;
      margin-right: 50px;
      margin-top: 20px;
      a {
        font-size: 28px;
        color: #fff;
      }
    }
  }
}
</style>