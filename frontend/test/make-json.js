/**
 * Created by zhongzhengkai on 2017/6/1.
 */


var fs = require('fs');

// 数据格式
[
  {
    text: '718',
    src: '/image/Referral_image/introduction/car-718.png',
    childs: [
      {"id":0,"text":"718 Cayman","detail":{"header":"718 Cayman","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"588,000 元，含增值税 *"},{"title":"功率","content":"184 kW (250 hp) / "},{"title":"最大扭矩 / 对应转速","content":"310 Nm / 1,850 - 5"},{"title":"0 - 100 km/h 加速时间","content":"5.6 s (配备 Sport Ch"},{"title":"最高时速","content":"260 km/h"},{"title":"耗油量 混合(l/100 km)","content":"7.2"}]}},
      {"id":1,"text":"718 Cayman S","detail":{"header":"718 Cayman S","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"848,000 元，含增值税 *"},{"title":"功率","content":"257 kW (350 hp) / "},{"title":"最大扭矩 / 对应转速","content":"420 Nm / 1,900 - 4"},{"title":"0 - 100 km/h 加速时间","content":"4.4 s (配备 Sport Ch"},{"title":"最高时速","content":"285 km/h"},{"title":"耗油量 混合(l/100 km)","content":"7.7"}]}},
      {"id":2,"text":"718 Boxster","detail":{"header":"718 Cayman S","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"598,000 元，含增值税 *"},{"title":"功率","content":"184 kW (250 hp) / "},{"title":"最大扭矩 / 对应转速","content":"310 Nm / 1,850 - 5"},{"title":"0 - 100 km/h 加速时间","content":"5.6 s (配备 Sport Ch"},{"title":"最高时速","content":"260 km/h"},{"title":"耗油量 混合(l/100 km)","content":"7.2"}]}}
,{"id":3,"text":"718 Boxster","detail":{"header":"718 Cayman S","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"858,000 元，含增值税 *"},{"title":"功率","content":"257 kW (350 hp) / "},{"title":"最大扭矩 / 对应转速","content":"420 Nm / 1,900 - 4"},{"title":"0 - 100 km/h 加速时间","content":"4.4 s (配备 Sport Ch"},{"title":"最高时速","content":"285 km/h"},{"title":"耗油量 混合(l/100 km)","content":"7.7"}]}}
    ]
  },
  {
    text: '911',
    src: '/image/Referral_image/introduction/car-911.png',
    childs: [
      {"id":0,"text":"911 Carrera","detail":{"header":"911 Carrera","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,318,000 元，含增值税 *"},{"title":"功率","content":"272 kW (370 hp) / 6,"},{"title":"最大扭矩 / 对应转速","content":"450 Nm / 1,700 - 5,0"},{"title":"0 - 100 km/h 加速时间","content":"4.4 s (配备 Sport Chro"},{"title":"最高时速","content":"293 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"7.8"}]}}
,{"id":1,"text":"911 Carrera S","detail":{"header":"911 Carrera S","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,521,000 元，含增值税 *"},{"title":"功率","content":"309 kW (420 hp) / 6,"},{"title":"最大扭矩 / 对应转速","content":"500 Nm / 1,700 - 5,0"},{"title":"0 - 100 km/h 加速时间","content":"4.1 s (配备 Sport Chro"},{"title":"最高时速","content":"306 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"8.1"}]}}
,{"id":2,"text":"911 Carrera GTS","detail":{"header":"911 Carrera GTS","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,610,000 元，含增值税 *"},{"title":"功率","content":"331 kW (450 hp) / 6,"},{"title":"最大扭矩 / 对应转速","content":"550 Nm / 2,150 - 5,0"},{"title":"0 - 100 km/h 加速时间","content":"3.7 s"},{"title":"最高时速","content":"310 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"8.3"}]}}
,{"id":3,"text":"911 Carrera Cabriolet","detail":{"header":"911 Carrera Cabriolet","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,464,000 元，含增值税 *"},{"title":"功率","content":"272 kW (370 hp) / 6,"},{"title":"最大扭矩 / 对应转速","content":"450 Nm / 1,700 - 5,0"},{"title":"0 - 100 km/h 加速时间","content":"4.6 s (配备 Sport Chro"},{"title":"最高时速","content":"290 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"7.9"}]}}
,{"id":4,"text":"911 Carrera S Cabriolet","detail":{"header":"911 Carrera S Cabriolet","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,667,000 元，含增值税 *"},{"title":"功率","content":"309 kW (420 hp) / 6,"},{"title":"最大扭矩 / 对应转速","content":"500 Nm / 1,700 - 5,0"},{"title":"0 - 100 km/h 加速时间","content":"4.3 s (配备 Sport Chro"},{"title":"最高时速","content":"304 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"8.3"}]}}
,{"id":5,"text":"911 Carrera GTS Cabriolet","detail":{"header":"911 Carrera GTS Cabriolet","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,756,000 元，含增值税 *"},{"title":"功率","content":"331 kW (450 hp) / 6,"},{"title":"最大扭矩 / 对应转速","content":"550 Nm / 2,150 - 5,0"},{"title":"0 - 100 km/h 加速时间","content":"3.8 s"},{"title":"最高时速","content":"308 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"8.3"}]}}
,{"id":6,"text":"911 Carrera 4","detail":{"header":"911 Carrera 4","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,406,000 元，含增值税 *"},{"title":"功率","content":"272 kW (370 hp) / 6,"},{"title":"最大扭矩 / 对应转速","content":"450 Nm / 1,700 - 5,0"},{"title":"0 - 100 km/h 加速时间","content":"4.3 s (配备 Sport Chro"},{"title":"最高时速","content":"290 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"8.4"}]}}
,{"id":7,"text":"911 Carrera 4S","detail":{"header":"911 Carrera 4S","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,609,000 元，含增值税 *"},{"title":"功率","content":"309 kW (420 hp) / 6,"},{"title":"最大扭矩 / 对应转速","content":"500 Nm / 1,700 - 5,0"},{"title":"0 - 100 km/h 加速时间","content":"4.0 s (配备 Sport Chro"},{"title":"最高时速","content":"303 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"8.5"}]}}
,{"id":8,"text":"911 Carrera 4 GTS","detail":{"header":"911 Carrera 4 GTS","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,698,000 元，含增值税 *"},{"title":"功率","content":"331 kW (450 hp) / 6,"},{"title":"最大扭矩 / 对应转速","content":"550 Nm / 2,150 - 5,0"},{"title":"0 - 100 km/h 加速时间","content":"3.6 s"},{"title":"最高时速","content":"308 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"8.9"}]}}
,{"id":9,"text":"911 Carrera 4 Cabriolet","detail":{"header":"911 Carrera 4 Cabriolet","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,552,000 元，含增值税 *"},{"title":"功率","content":"272 kW (370 hp) / 6,"},{"title":"最大扭矩 / 对应转速","content":"450 Nm / 1,700 - 5,0"},{"title":"0 - 100 km/h 加速时间","content":"4.5 s (配备 Sport Chro"},{"title":"最高时速","content":"287 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"8.5"}]}}
,{"id":10,"text":"911 Carrera 4S Cabriolet","detail":{"header":"911 Carrera 4S Cabriolet","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,755,000 元，含增值税 *"},{"title":"功率","content":"309 kW (420 hp) / 6,"},{"title":"最大扭矩 / 对应转速","content":"500 Nm / 1,700 - 5,0"},{"title":"0 - 100 km/h 加速时间","content":"4.2 s (配备 Sport Chro"},{"title":"最高时速","content":"301 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"8.5"}]}}
,{"id":11,"text":"911 Carrera 4 GTS Cabriolet","detail":{"header":"911 Carrera 4 GTS Cabriolet","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,844,000 元，含增值税 *"},{"title":"功率","content":"331 kW (450 hp) / 6,"},{"title":"最大扭矩 / 对应转速","content":"550 Nm / 2,150 - 5,0"},{"title":"0 - 100 km/h 加速时间","content":"3.7 s"},{"title":"最高时速","content":"306 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"8.9"}]}}
,{"id":12,"text":"911 Targa 4","detail":{"header":"911 Targa 4","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,844,000 元，含增值税 *"},{"title":"功率","content":"331 kW (450 hp) / 6,"},{"title":"最大扭矩 / 对应转速","content":"550 Nm / 2,150 - 5,0"},{"title":"0 - 100 km/h 加速时间","content":"3.7 s"},{"title":"最高时速","content":"306 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"8.9"}]}}
,{"id":13,"text":"911 Targa 4S","detail":{"header":"911 Targa 4S","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,755,000 元，含增值税 *"},{"title":"功率","content":"309 kW (420 hp) / 6,"},{"title":"最大扭矩 / 对应转速","content":"500 Nm / 1,700 - 5,0"},{"title":"0 - 100 km/h 加速时间","content":"4.2 s (配备 Sport Chro"},{"title":"最高时速","content":"301 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"8.6"}]}}
,{"id":14,"text":"911 Targa 4 GTS","detail":{"header":"911 Targa 4 GTS","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,844,000 元，含增值税 *"},{"title":"功率","content":"331 kW (450 hp) / 6,"},{"title":"最大扭矩 / 对应转速","content":"550 Nm / 2,150 - 5,0"},{"title":"0 - 100 km/h 加速时间","content":"3.7 s"},{"title":"最高时速","content":"306 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"8.9"}]}}
,{"id":15,"text":"911 Turbo","detail":{"header":"911 Turbo","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"2,305,000 元，含增值税 *"},{"title":"功率","content":"397 kW (540 hp) / 6,"},{"title":"最大扭矩 / 对应转速","content":"660 Nm / 1,950 - 5,0"},{"title":"0 - 100 km/h 加速时间","content":"3.0 s 配备 Sport Chron"},{"title":"最高时速","content":"320 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"10.0"}]}}
,{"id":16,"text":"911 Turbo S","detail":{"header":"911 Turbo S","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"2,615,000 元，含增值税 *"},{"title":"功率","content":"427 kW (580 hp) / 6,"},{"title":"最大扭矩 / 对应转速","content":"700 Nm / 2,100 - 4,2"},{"title":"0 - 100 km/h 加速时间","content":"2.9 s 配备 Sport Chron"},{"title":"最高时速","content":"330 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"10.0"}]}}
,{"id":17,"text":"911 Turbo Cabriolet","detail":{"header":"911 Turbo Cabriolet","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"2,451,000 元，含增值税 *"},{"title":"功率","content":"397 kW (540 hp) / 6,"},{"title":"最大扭矩 / 对应转速","content":"660 Nm / 1,950 - 5,0"},{"title":"0 - 100 km/h 加速时间","content":"3.1 s 配备 Sport Chron"},{"title":"最高时速","content":"320 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"10.2"}]}}
,{"id":17,"text":"911 Turbo S Cabriolet","detail":{"header":"911 Turbo S Cabriolet","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"2,761,000 元，含增值税 *"},{"title":"功率","content":"427 kW (580 hp) / 6,"},{"title":"最大扭矩 / 对应转速","content":"700 Nm / 2,100 - 4,2"},{"title":"0 - 100 km/h 加速时间","content":"3.0 s 配备 Sport Chron"},{"title":"最高时速","content":"330 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"10.2"}]}}
    ]
  },
  {
    text: 'Panamera',
    src: '/image/Referral_image/introduction/car-718.png',
    childs: [
      {"id":0,"text":"全新 Panamera","detail":{"header":"全新 Panamera","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,088,000 元，含增值税 *"},{"title":"功率","content":"243 kW (330 hp) / 5,"},{"title":"最大扭矩 / 对应转速","content":"450 Nm / 1,340 - 4,9"},{"title":"0 - 100 km/h 加速时间","content":"5.7 s (配备 Sport Chro"},{"title":"最高时速","content":"264 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"7.3"}]}}
,{"id":1,"text":"全新 Panamera 行政加长版","detail":{"header":"全新 Panamera 行政加长版","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,258,000 元，含增值税 *"},{"title":"功率","content":"243 kW (330 hp) / 5,"},{"title":"最大扭矩 / 对应转速","content":"450 Nm / 1,340 - 4,9"},{"title":"0 - 100 km/h 加速时间","content":"5.8 s (配备 Sport Chro"},{"title":"最高时速","content":"264 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"7.4"}]}}
,{"id":2,"text":"全新 Panamera 4 行政加长版","detail":{"header":"全新 Panamera 4 行政加长版","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,328,000 元，含增值税 *"},{"title":"功率","content":"243 kW (330 hp) / 5,"},{"title":"最大扭矩 / 对应转速","content":"450 Nm / 1,340 - 4,9"},{"title":"0 - 100 km/h 加速时间","content":"5.6 s (配备 Sport Chro"},{"title":"最高时速","content":"262 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"7.7"}]}}
,{"id":3,"text":"全新 Panamera 4 Sport Turismo","detail":{"header":"全新 Panamera 4 Sport Turismo","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,298,000 元，含增值税 *"},{"title":"功率","content":"243 kW (330 hp ) / 5"},{"title":"最大扭矩 / 对应转速","content":"450 Nm / 1,340 - 4,9"},{"title":"0 - 100 km/h 加速时间","content":"5.5 s (配备 Sport Chro"},{"title":"最高时速","content":"259 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"适时公布"}]}}
,{"id":4,"text":"全新 Panamera 4 E-Hybrid 行政加长版","detail":{"header":"全新 Panamera 4 E-Hybrid 行政加长版","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,438,000 元，含增值税 *"},{"title":"功率","content":"内燃机：243 kW (330 hp);"},{"title":"最大扭矩 / 对应转速","content":"内燃机：450 Nm / 1,750 -"},{"title":"0 - 100 km/h 加速时间","content":"适时公布"},{"title":"最高时速","content":"278 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"适时公布"},{"title":"二氧化碳排放量 (g/km)","content":"适时公布"},{"title":"耗电量 (混合) (kWh/100 km)","content":"适时公布"}]}}
,{"id":5,"text":"全新 Panamera 4 E-Hybrid Sport Turismo","detail":{"header":"全新 Panamera 4 E-Hybrid Sport Turismo","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,408,000 元，含增值税 *"},{"title":"功率","content":"内燃机：243 kW (330 hp);"},{"title":"最大扭矩 / 对应转速","content":"内燃机：450 Nm / 1,750 -"},{"title":"0 - 100 km/h 加速时间","content":"适时公布"},{"title":"最高时速","content":"275 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"适时公布"},{"title":"二氧化碳排放量 (g/km)","content":"适时公布"},{"title":"耗电量 (混合) (kWh/100 km)","content":"适时公布"}]}}
,{"id":6,"text":"全新 Panamera 4S","detail":{"header":"全新 Panamera 4S","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,698,000 元，含增值税 *"},{"title":"功率","content":"324 kW (440 hp) / 5,"},{"title":"最大扭矩 / 对应转速","content":"550 Nm / 1,750 - 5,5"},{"title":"0 - 100 km/h 加速时间","content":"4.4 s (配备 Sport Chro"},{"title":"最高时速","content":"289 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"8.3"}]}}
,{"id":7,"text":"全新 Panamera 4S Sport Turismo","detail":{"header":"全新 Panamera 4S Sport Turismo","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,728,000 元，含增值税 *"},{"title":"功率","content":"324 kW (440 hp ) / 5"},{"title":"最大扭矩 / 对应转速","content":"550 Nm / 1,750 - 5,5"},{"title":"0 - 100 km/h 加速时间","content":"4.4 s (配备 Sport Chro"},{"title":"最高时速","content":"286 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"适时公布"}]}}
,{"id":8,"text":"全新 Panamera Turbo","detail":{"header":"全新 Panamera Turbo","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"2,198,000 元，含增值税 *"},{"title":"功率","content":"404 kW (550 hp) / 5,"},{"title":"最大扭矩 / 对应转速","content":"770 Nm / 1,960 - 4,5"},{"title":"0 - 100 km/h 加速时间","content":"3.8 s (配备 Sport Chro"},{"title":"最高时速","content":"306 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"9.8"}]}}
,{"id":9,"text":"全新 Panamera Turbo 行政加长版","detail":{"header":"全新 Panamera Turbo 行政加长版","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"2,338,000 元，含增值税 *"},{"title":"功率","content":"404 kW (550 hp) / 5,"},{"title":"最大扭矩 / 对应转速","content":"770 Nm / 1,960 - 4,5"},{"title":"0 - 100 km/h 加速时间","content":"3.9 s (配备 Sport Chro"},{"title":"最高时速","content":"306 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"9.8"}]}}
,{"id":10,"text":"全新 Panamera Turbo Sport Turismo","detail":{"header":"全新 Panamera Turbo Sport Turismo","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"2,228,000 元，含增值税 *"},{"title":"功率","content":"404 kW (550 hp ) / 5"},{"title":"最大扭矩 / 对应转速","content":"770 Nm / 1,960 - 4,5"},{"title":"0 - 100 km/h 加速时间","content":"3.8 s (配备 Sport Chro"},{"title":"最高时速","content":"304 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"适时公布"}]}}
,{"id":11,"text":"全新 Panamera Turbo S E-Hybrid 行政加长版","detail":{"header":"全新 Panamera Turbo S E-Hybrid 行政加长版","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"2,738,000 元，含增值税 *"},{"title":"功率","content":"内燃机：404 kW (550 hp);"},{"title":"最大扭矩 / 对应转速","content":"内燃机：770 Nm / 1,960 -"},{"title":"0 - 100 km/h 加速时间","content":"适时公布"},{"title":"最高时速","content":"290 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"适时公布"},{"title":"二氧化碳排放量 (g/km)","content":"适时公布"},{"title":"耗电量 (混合) (kWh/100 km)","content":"适时公布"}]}}

    ]
  },
  {
    text: 'Macan',
    src: '/image/Referral_image/introduction/car-718.png',
    childs: [
      {"id":0,"text":"Macan","detail":{"header":"Macan","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"588,000 元，含增值税 *"},{"title":"功率","content":"185 kW (252 hp) / "},{"title":"最大扭矩 (Nm) /","content":" 对应转速370 Nm / 1,60"},{"title":"0 - 100 km/h 加速时间","content":"6.7 s (配备 Sport Ch"},{"title":"最高时速","content":"229 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"7.9"}]}}
,{"id":1,"text":"Macan S","detail":{"header":"Macan S","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"698,000 元，含增值税 *"},{"title":"功率","content":"250 kW (340 hp) / "},{"title":"最大扭矩 (Nm) /","content":" 对应转速460 Nm / 1,45"},{"title":"0 - 100 km/h 加速时间","content":"5.4 s (配备 Sport Ch"},{"title":"最高时速","content":"254 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"9.8"}]}}
,{"id":2,"text":"Macan GTS","detail":{"header":"Macan GTS","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"888,000 元，含增值税 *"},{"title":"功率","content":"265 kW (360 hp) / "},{"title":"最大扭矩 (Nm) /","content":" 对应转速500 Nm / 1,65"},{"title":"0 - 100 km/h 加速时间","content":"5.2 s (配备 Sport Ch"},{"title":"最高时速","content":"256 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"9.8"}]}}
,{"id":3,"text":"Macan Turbo","detail":{"header":"Macan Turbo","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"998,000 元，含增值税 *"},{"title":"功率","content":"294 kW (400 hp) / "},{"title":"最大扭矩 (Nm) /","content":" 对应转速550 Nm / 1,35"},{"title":"0 - 100 km/h 加速时间","content":"4.8 s (配备 Sport Ch"},{"title":"最高时速","content":"266 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"9.9"}]}}
,{"id":4,"text":"Macan Turbo with Performance Package","detail":{"header":"Macan Turbo with Performance Package","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,124,100 元，含增值税 *"},{"title":"功率","content":"324 kW (440 hp) / 6,"},{"title":"最大扭矩 (Nm) /","content":" 对应转速600 Nm / 1,500 "},{"title":"0 - 100 km/h 加速时间","content":"4.4 s 配备 Sport Chron"},{"title":"最高时速","content":"272 km/h"},{"title":"耗油量 混合(l/100 km)","content":"9.9"}]}}

    ]
  },
  {
    text: 'Cayenne',
    src: '/image/Referral_image/introduction/car-718.png',
    childs: [
      {"id":0,"text":"Cayenne","detail":{"header":"Cayenne","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"888,000 元，含增值税 *"},{"title":"功率","content":"245 kW (333 hp) / "},{"title":"最大扭矩 (Nm) /","content":" 对应转速440 Nm / 3,00"},{"title":"0 - 100 km/h 加速时间","content":"6.9 s (配备 Sport Ch"},{"title":"最高时速","content":"239 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"10.2"}]}}
,{"id":1,"text":"Cayenne Platinum Edition","detail":{"header":"Cayenne Platinum Edition","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"984,000 元，含增值税 *"},{"title":"功率","content":"245 kW (333 hp) / "},{"title":"最大扭矩 (Nm) /","content":" 对应转速440 Nm / 3,00"},{"title":"0 - 100 km/h 加速时间","content":"6.9 s (配备 Sport Ch"},{"title":"最高时速","content":"239 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"10.4"}]}}
,{"id":2,"text":"Cayenne S","detail":{"header":"Cayenne S","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,369,000 元，含增值税 *"},{"title":"功率","content":"309 kW (420 hp) / 6,"},{"title":"最大扭矩 (Nm) /","content":" 对应转速550 Nm / 1,350 "},{"title":"0 - 100 km/h 加速时间","content":"5.5 s (配备 Sport Chro"},{"title":"最高时速","content":"259 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"10.5"}]}}
,{"id":3,"text":"Cayenne S E-Hybrid","detail":{"header":"Cayenne S E-Hybrid","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,088,000 元，含增值税 *"},{"title":"功率","content":"内燃机：245 kW (333 hp);"},{"title":"最大扭矩 (Nm) /","content":" 对应转速内燃机： 440 Nm / 3"},{"title":"0 - 100 km/h 加速时间","content":"5.9 s 配备 Sport Chron"},{"title":"最高时速","content":"243 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"2.9"}]}}
,{"id":4,"text":"Cayenne GTS","detail":{"header":"Cayenne GTS","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"1,586,000 元，含增值税 *"},{"title":"功率","content":"324 kW (440 hp) / 6,"},{"title":"最大扭矩 (Nm) /","content":" 对应转速600 Nm / 1,600 "},{"title":"0 - 100 km/h 加速时间","content":"5.2 s (配备 Sport Chro"},{"title":"最高时速","content":"262 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"10.8"}]}}
,{"id":5,"text":"Cayenne Turbo","detail":{"header":"Cayenne Turbo","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"2,214,000 元，含增值税 *"},{"title":"功率","content":"382 kW (520 hp) / 6,"},{"title":"最大扭矩 (Nm) /","content":" 对应转速750 Nm / 2,250 "},{"title":"0 - 100 km/h 加速时间","content":"4.5 s (配备 Sport Chro"},{"title":"最高时速","content":"279 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"12.2"}]}}
,{"id":6,"text":"Cayenne Turbo S","detail":{"header":"Cayenne Turbo S","src":"/image/Referral_image/introduction/","contents":[{"title":"价格","content":"2,839,000 元，含增值税 *"},{"title":"功率","content":"419 kW (570 hp) / 6,"},{"title":"最大扭矩 (Nm) /","content":" 对应转速800 Nm / 2,500 "},{"title":"0 - 100 km/h 加速时间","content":"4.1 s 配备 Sport Chron"},{"title":"最高时速","content":"284 km/h"},{"title":"耗油量 混合 (l/100 km)","content":"12.5"}]}}

    ]
  },
]
//


var str = `
价格2,839,000 元，含增值税 *
功率419 kW (570 hp) / 6,000 rpm
最大扭矩 (Nm) / 对应转速800 Nm / 2,500 - 4,000 rpm
0 - 100 km/h 加速时间4.1 s 配备 Sport Chrono 组件
最高时速284 km/h
耗油量 混合 (l/100 km)12.5
`;
// console.log(JSON.stringify(generateConfig(str,0,'718 Cayman','718 Cayman'),null,1));
console.log(JSON.stringify(generateConfig(str,4,'Cayenne Turbo S')));

function generateConfig(contentsStr, childId=0, childText='default text', src='/image/Referral_image/introduction/'){
  return {id:childId, text:childText, detail:{header:childText, src, contents:parseStr(contentsStr)}}
}


function parseStr(str) {
  var arr = str.split('\n');
  var result = [];
  result.push({title:arr[1].substr(0, 2),content:arr[1].substr(2,arr[1].length)});
  result.push({title:arr[2].substr(0, 2),content:arr[2].substr(2,arr[1].length)});
  result.push({title:arr[3].substr(0, 11),content:arr[3].substr(11,arr[1].length)});
  result.push({title:arr[4].substr(0, 17),content:arr[4].substr(17,arr[1].length)});
  result.push({title:arr[5].substr(0, 4),content:arr[5].substr(4,arr[1].length)});
  result.push({title:arr[6].substr(0, 16),content:arr[6].substr(16,arr[1].length)});
  if(arr.length==10){
    result.push({title:arr[7].substr(0, 14),content:arr[7].substr(14,arr[1].length)});
    result.push({title:arr[8].substr(0, 21),content:arr[8].substr(21,arr[1].length)});
  }
  return result
}

// console.log(generateConfig(str));
