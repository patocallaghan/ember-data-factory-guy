import { make, mockCreate } from 'ember-data-factory-guy';
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | User View');
// NOTE
// FactoryGuy before and after setup is in moduleForAcceptance helper

test("Creates new project", function () {
  // create a user with projects ( which will be in the store )
  let user = make('user', 'with_projects');

  visit('/user/' + user.id);

  let newProjectTitle = "Gonzo Project";

  andThen(function () {
    fillIn('input.project-title', newProjectTitle);

    // Remember, this is for handling an exact match, if you did not care about
    // matching attributes, you could just do: TestHelper.mockCreate('project')
    mockCreate('project').match({title: newProjectTitle, user: user});

    /**
     Let's say that clicking this 'button:contains(Add New User)', triggers action in the
     view to create project record and looks something like this:

     actions: {
       addProject: function (user) {
         let title = this.$('input.project-title').val();
         let store = this.get('controller.store');
         store.createRecord('project', {title: title, user: user}).save();
       }
     }

    */
    click('button:contains(Add New User)');

    andThen(function () {
      let newProjectDiv = find('li.project:contains(' + newProjectTitle + ')');
      ok(newProjectDiv[0] !== undefined);
    });
  });
});