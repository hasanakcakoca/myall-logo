(function () {
  'use strict';

  function TransactionsController(
    $scope,
    $rootScope,
    $timeout,
    NgTableParams,
    LogoService
  ) {
    $scope.forms = [{
      type: 1,
      name: 'Bakiye'
    }, {
      type: 2,
      name: 'Form BA'
    }, {
      type: 3,
      name: 'Form BS'
    }];

    $scope.getFirms = function () {
      LogoService.getFirms().then(firms =>
        $scope.$applyAsync(() => {
          delete $scope.firm;
          $scope.firms = firms;
        })
      );
    };

    $scope.selectFirm = function (firm) {
      $scope.firm = firm;

      LogoService.getPeriod(firm.NR).then(period => {
        $scope.period = _.head(period);
      });
    };

    $scope.selectForm = function (form) {
      $scope.form = form;
    };

    $timeout(() => {
      $scope.data = [{"id":1,"first_name":"Virginia","last_name":"Jones","email":"vjones0@craigslist.org","gender":"Female","ip_address":"39.181.245.67"},
        {"id":2,"first_name":"Rose","last_name":"Fowler","email":"rfowler1@pbs.org","gender":"Female","ip_address":"65.156.18.92"},
        {"id":3,"first_name":"John","last_name":"Rice","email":"jrice2@163.com","gender":"Male","ip_address":"158.35.224.226"},
        {"id":4,"first_name":"Marie","last_name":"George","email":"mgeorge3@alexa.com","gender":"Female","ip_address":"122.253.106.155"},
        {"id":5,"first_name":"Angela","last_name":"Mccoy","email":"amccoy4@sphinn.com","gender":"Female","ip_address":"142.163.28.178"},
        {"id":6,"first_name":"Edward","last_name":"Barnes","email":"ebarnes5@photobucket.com","gender":"Male","ip_address":"230.202.85.82"},
        {"id":7,"first_name":"Wayne","last_name":"Burton","email":"wburton6@icio.us","gender":"Male","ip_address":"73.211.151.143"},
        {"id":8,"first_name":"Clarence","last_name":"Flores","email":"cflores7@odnoklassniki.ru","gender":"Male","ip_address":"195.221.18.103"},
        {"id":9,"first_name":"Fred","last_name":"Rose","email":"frose8@digg.com","gender":"Male","ip_address":"183.91.86.55"},
        {"id":10,"first_name":"Peter","last_name":"Wheeler","email":"pwheeler9@yahoo.com","gender":"Male","ip_address":"218.153.98.71"},
        {"id":11,"first_name":"Edward","last_name":"Phillips","email":"ephillipsa@parallels.com","gender":"Male","ip_address":"134.22.239.134"},
        {"id":12,"first_name":"Nicholas","last_name":"Robinson","email":"nrobinsonb@bing.com","gender":"Male","ip_address":"58.84.218.166"},
        {"id":13,"first_name":"Ruth","last_name":"Morrison","email":"rmorrisonc@gnu.org","gender":"Female","ip_address":"185.237.99.239"},
        {"id":14,"first_name":"Christopher","last_name":"Williamson","email":"cwilliamsond@usatoday.com","gender":"Male","ip_address":"175.55.126.244"},
        {"id":15,"first_name":"Stephen","last_name":"Lane","email":"slanee@mayoclinic.com","gender":"Male","ip_address":"206.229.202.75"},
        {"id":16,"first_name":"Martha","last_name":"Edwards","email":"medwardsf@yelp.com","gender":"Female","ip_address":"186.141.0.146"},
        {"id":17,"first_name":"James","last_name":"Knight","email":"jknightg@un.org","gender":"Male","ip_address":"13.85.17.227"},
        {"id":18,"first_name":"Tammy","last_name":"James","email":"tjamesh@psu.edu","gender":"Female","ip_address":"118.148.109.244"},
        {"id":19,"first_name":"Mildred","last_name":"Brown","email":"mbrowni@reuters.com","gender":"Female","ip_address":"164.198.228.235"},
        {"id":20,"first_name":"Carl","last_name":"Burns","email":"cburnsj@mtv.com","gender":"Male","ip_address":"190.138.225.40"},
        {"id":21,"first_name":"Diane","last_name":"Ramos","email":"dramosk@un.org","gender":"Female","ip_address":"15.70.1.31"},
        {"id":22,"first_name":"George","last_name":"Lawson","email":"glawsonl@youtube.com","gender":"Male","ip_address":"35.15.2.88"},
        {"id":23,"first_name":"Maria","last_name":"Roberts","email":"mrobertsm@vistaprint.com","gender":"Female","ip_address":"124.65.116.133"},
        {"id":24,"first_name":"Dennis","last_name":"Coleman","email":"dcolemann@businessweek.com","gender":"Male","ip_address":"113.221.141.37"},
        {"id":25,"first_name":"Angela","last_name":"Stone","email":"astoneo@nps.gov","gender":"Female","ip_address":"168.245.28.216"},
        {"id":26,"first_name":"Melissa","last_name":"Carroll","email":"mcarrollp@eepurl.com","gender":"Female","ip_address":"110.188.87.245"},
        {"id":27,"first_name":"Jose","last_name":"Simmons","email":"jsimmonsq@unblog.fr","gender":"Male","ip_address":"61.173.147.79"},
        {"id":28,"first_name":"Billy","last_name":"Fuller","email":"bfullerr@theguardian.com","gender":"Male","ip_address":"210.11.46.207"},
        {"id":29,"first_name":"Eugene","last_name":"Murray","email":"emurrays@bravesites.com","gender":"Male","ip_address":"255.104.172.240"},
        {"id":30,"first_name":"Bruce","last_name":"Sanchez","email":"bsanchezt@mtv.com","gender":"Male","ip_address":"239.123.180.179"},
        {"id":31,"first_name":"Deborah","last_name":"Patterson","email":"dpattersonu@kickstarter.com","gender":"Female","ip_address":"121.111.65.77"},
        {"id":32,"first_name":"Gary","last_name":"Patterson","email":"gpattersonv@smh.com.au","gender":"Male","ip_address":"229.157.51.110"},
        {"id":33,"first_name":"Wayne","last_name":"Reed","email":"wreedw@dion.ne.jp","gender":"Male","ip_address":"103.242.233.144"},
        {"id":34,"first_name":"Ronald","last_name":"Little","email":"rlittlex@ucoz.ru","gender":"Male","ip_address":"65.44.229.193"},
        {"id":35,"first_name":"Betty","last_name":"Freeman","email":"bfreemany@comcast.net","gender":"Female","ip_address":"157.15.159.23"},
        {"id":36,"first_name":"Emily","last_name":"Ortiz","email":"eortizz@zimbio.com","gender":"Female","ip_address":"62.210.15.214"},
        {"id":37,"first_name":"Jose","last_name":"Stevens","email":"jstevens10@foxnews.com","gender":"Male","ip_address":"114.209.234.227"},
        {"id":38,"first_name":"Martin","last_name":"Bryant","email":"mbryant11@scientificamerican.com","gender":"Male","ip_address":"235.19.104.242"},
        {"id":39,"first_name":"Cheryl","last_name":"Schmidt","email":"cschmidt12@usnews.com","gender":"Female","ip_address":"199.233.82.145"},
        {"id":40,"first_name":"Shawn","last_name":"Grant","email":"sgrant13@unicef.org","gender":"Male","ip_address":"59.199.20.197"},
        {"id":41,"first_name":"Frank","last_name":"Knight","email":"fknight14@examiner.com","gender":"Male","ip_address":"56.150.101.255"},
        {"id":42,"first_name":"Gregory","last_name":"Johnston","email":"gjohnston15@china.com.cn","gender":"Male","ip_address":"236.4.67.15"},
        {"id":43,"first_name":"Samuel","last_name":"Davis","email":"sdavis16@biglobe.ne.jp","gender":"Male","ip_address":"64.24.73.212"},
        {"id":44,"first_name":"Larry","last_name":"Jackson","email":"ljackson17@disqus.com","gender":"Male","ip_address":"163.47.249.123"},
        {"id":45,"first_name":"Cynthia","last_name":"Davis","email":"cdavis18@symantec.com","gender":"Female","ip_address":"114.212.191.37"},
        {"id":46,"first_name":"Cynthia","last_name":"Lawson","email":"clawson19@home.pl","gender":"Female","ip_address":"225.56.66.51"},
        {"id":47,"first_name":"Evelyn","last_name":"Garcia","email":"egarcia1a@toplist.cz","gender":"Female","ip_address":"84.177.193.124"},
        {"id":48,"first_name":"Kimberly","last_name":"Dunn","email":"kdunn1b@shop-pro.jp","gender":"Female","ip_address":"115.248.152.211"},
        {"id":49,"first_name":"Donna","last_name":"Nichols","email":"dnichols1c@cnet.com","gender":"Female","ip_address":"106.102.106.99"},
        {"id":50,"first_name":"Jennifer","last_name":"Porter","email":"jporter1d@amazon.de","gender":"Female","ip_address":"213.91.160.54"},
        {"id":51,"first_name":"Norma","last_name":"Lawson","email":"nlawson1e@wikipedia.org","gender":"Female","ip_address":"224.200.1.93"},
        {"id":52,"first_name":"Heather","last_name":"Nguyen","email":"hnguyen1f@alibaba.com","gender":"Female","ip_address":"250.195.107.61"},
        {"id":53,"first_name":"Jerry","last_name":"Hawkins","email":"jhawkins1g@wired.com","gender":"Male","ip_address":"26.133.98.87"},
        {"id":54,"first_name":"Maria","last_name":"Robinson","email":"mrobinson1h@usnews.com","gender":"Female","ip_address":"76.82.31.137"},
        {"id":55,"first_name":"Pamela","last_name":"Fowler","email":"pfowler1i@sciencedaily.com","gender":"Female","ip_address":"9.42.254.227"}];

      $scope.tableParams = new NgTableParams({},
        {dataset: $scope.data}
      );

      $scope.$watch('$root.connection', () =>
        $rootScope.connection ?
          $scope.getFirms() :
          $rootScope.showConnectionSettings()
      );
    });
  }

  angular.module('app').controller('TransactionsController', [
    '$scope',
    '$rootScope',
    '$timeout',
    'NgTableParams',
    'LogoService',
    TransactionsController
  ]);
})();
