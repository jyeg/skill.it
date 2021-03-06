'use strict';
var db = require('../config/database');
var UserFavorites = db.userFavorites;
var Guide = db.guide;
var Section = db.section;
var Link = db.link;

/**
 * POST /userFavorites
 * @param guideId
 * @param userId
 * @param sectionId
 * @param linkId
 */
var toggleUserFavorite = function(req, res, next) {
  // console.log('UserID: ', req.user.id);

  var userId = req.user.id || 3;
  var holdUserFavorites;
  var guideToDelete;
  // console.log('GuideId: ', req.body.guideId);
  // // req.guide = {id:1};
  // // console.log(req);
  // console.log(Console.log('req', req.guideIdToSend);
  // console.log('User ID: ', userId);
  UserFavorites.findOrCreate({
    userId: userId
  })
  .then(function(userFavorites) {
    if (req.body.guideId) {
      console.log('User Favorites: ', userFavorites);
      holdUserFavorites = userFavorites;

      return userFavorites.getGuides({where: {
        guideId: req.body.guideId
      }});

    } else {
      return res.status(400).json({
        errors: [{
          msg: 'Request not formatted properly.'
        }]
      });
    }
  })
  .then(function(userFavoriteResource) {
    console.log("GuideID: ", userFavoriteResource);
    if(userFavoriteResource.length === 0) {
      return Guide.find({where:{
        id: req.body.guideId
      }});
    } else {
      console.log("already Favorited");
      // guideToDelete = userFavoriteResource[0];
      // userFavoriteResource.destroy({where: { guideId: req.body.guideId }}).then(function() {
      //   console.log('I am now dust...');
      // });



      // userFavoriteResource[0].destroy().then(function() {
      //   console.log('I am now dust...');
      // });
      // return holdUserFavorites.removeGuide(userFavoriteResource[0]);
      return "alreadyFavorited";
    }
  })
  .then(function(newFavoriteGuide) {
    console.log("In add Guide: ", newFavoriteGuide);
    if (newFavoriteGuide !== "alreadyFavorited") {
      return holdUserFavorites.addGuide(newFavoriteGuide);
    } else {
      console.log("Trying to remove...");
      // holdUserFavorites.destroy(guideToDelete);

      // UserFavorites.findAll()
    }
  })
  .then(function(userFavorites) {
    return res.status(200).json({
      userFavorites: userFavorites,
      success: [{
        msg:'UserFavorites updated successfully.'
      }]
    });
  })
  .error(function(err) {
    if (err) {
      return next(err);
    }
  })
};

/**
 * GET /userFavorites
 * Gets all users favorite guides
 */
var readUserFavorites = function(req, res, next) {
  var allUserFavorites = {};

  UserFavorites.findAll({
    where: {
      userId:  req.user.id
    },
		include: [
			{ model: Guide },
			{ model: Section },
			{ model: Link}
		]
	})
  .then(function(userFavorites) {
		allUserFavorites = userFavorites;
		res.status(200).json({
			userFavorites: allUserFavorites,
			success: [{
				msg: 'UserFavorites sent successfully.'
			}]
		});
  })
  .error(function(err) {
    if (err) {
      return next(err);
    }
  });
};

module.exports = {
  readUserFavorites: readUserFavorites,
  toggleUserFavorite: toggleUserFavorite
};

  // } else if (req.body.sectionId) {
    //   Section.find({ where: {
    //     id: req.body.sectionId
    //   }})
    //   .then(function(section) {
    //     userFavorites.addSection(section);
    //   });
    // } else if (req.body.linkId) {
    //   Link.find({ where: {
    //     id: req.body.linkId
    //   }})
    //   .then(function(link) {
    //     userFavorites.addLink(link);
    //   });


// .then(function(guide) {
      //   console.log("Favorite guide: ", guide);

      //   if (!guide) {
      //     userFavorites.addGuide(req.body.guideId);
      //   } else {
      //     userFavorites.removeGuide(req.body.guideId);
      //   }
      // });

      // Guide.find({ where: {
      //   id: req.body.guideId
      // }})
      // .then(function(guide) {
      //   // console.log('Guide: ', guide);
      //   if (!guide) {
      //     userFavorites.addGuide(guide);
      //   } else {
      //     userFavorites.removeGuide(guide);
      //   }
      // });