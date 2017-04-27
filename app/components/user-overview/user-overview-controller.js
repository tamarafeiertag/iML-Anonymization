'use strict';

angular.module('iMLApp.user-overview.user-overview-controller', [])

  .controller('UserOverviewCtrl', function (UserService, $rootScope) {


    var vm = this;

    vm.user = null;
    vm.allUsers = [];
    vm.deleteUser = deleteUser;

    initController();

    function initController() {
      loadCurrentUser();
      loadAllUsers();
    }

    function loadCurrentUser() {
      UserService.GetByUsername($rootScope.globals.currentUser.username)
        .then(function (user) {
          vm.user = user;
        });
    }

    function loadAllUsers() {
      UserService.GetAll()
        .then(function (users) {
          vm.allUsers = users;
        });
    }

    function deleteUser(id) {
      UserService.Delete(id)
        .then(function () {
          loadAllUsers();
        });
    }


  });