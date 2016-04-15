'use strict';

/* global bootstrapModeler, inject */

var modelingModule = require('../../../../lib/features/modeling'),
    coreModule = require('../../../../lib/core'),
    is = require('../../../../lib/util/ModelUtil').is;


describe('features/modeling CmmnUpdater', function() {

  var testModules = [ coreModule, modelingModule ];

  var testXML = require('./CmmnUpdater.cmmn');

  beforeEach(bootstrapModeler(testXML, { modules: testModules }));

  var rootElement;

  beforeEach(inject(function(canvas){
    rootElement = canvas.getRootElement();
  }));

  describe('update parent', function() {

    describe('for task', function() {

      var task_PI;

      beforeEach(inject(function(elementFactory) {
        task_PI = elementFactory.createPlanItemShape('cmmn:Task');
      }));

      describe('set case plan', function() {

        var casePlan;

        beforeEach(inject(function(elementRegistry, modeling) {
          casePlan = elementRegistry.get('CasePlan_1');

          modeling.createShape(task_PI, { x: 150, y: 490 }, casePlan);
        }));

        it('should execute', function() {

          var casePlan_BO = casePlan.businessObject,
              task_PI_BO = task_PI.businessObject;

          // then
          // check parent PI
          expect(task_PI.parent).to.equal(casePlan);

          // check semantic parent
          expect(task_PI_BO.$parent).to.exist;
          expect(task_PI_BO.$parent).to.equal(casePlan_BO);

          // check parent containment
          expect(casePlan_BO.get('planItems')).to.include(task_PI_BO);
          expect(casePlan_BO.get('planItemDefinitions')).to.include(task_PI_BO.definitionRef);

          // check parent di
          expect(task_PI_BO.di.$parent).to.equal(rootElement.businessObject);

          // check parent di containment
          expect(rootElement.businessObject.diagramElements).to.contain(task_PI_BO.di);
        });


        it('should undo', inject(function(commandStack) {

          commandStack.undo();

          var casePlan_BO = casePlan.businessObject,
              task_PI_BO = task_PI.businessObject;

          // then
          // check parent PI
          expect(task_PI.parent).to.be.null;

          // check semantic parent
          expect(task_PI_BO.$parent).to.be.null;

          // check parent containment
          expect(casePlan_BO.get('planItems')).not.to.include(task_PI_BO);
          expect(casePlan_BO.get('planItemDefinitions')).not.to.include(task_PI_BO.definitionRef);

          // check parent di
          expect(task_PI_BO.di.$parent).to.be.null;

          // check parent di containment
          expect(rootElement.businessObject.diagramElements).not.to.contain(task_PI_BO.di);
        }));


        it('should redo', inject(function(commandStack) {

          commandStack.undo();
          commandStack.redo();

          var casePlan_BO = casePlan.businessObject,
              task_PI_BO = task_PI.businessObject;

          // then
          // check parent PI
          expect(task_PI.parent).to.equal(casePlan);

          // check semantic parent
          expect(task_PI_BO.$parent).to.exist;
          expect(task_PI_BO.$parent).to.equal(casePlan_BO);

          // check parent containment
          expect(casePlan_BO.get('planItems')).to.include(task_PI_BO);
          expect(casePlan_BO.get('planItemDefinitions')).to.include(task_PI_BO.definitionRef);

          // check parent di
          expect(task_PI_BO.di.$parent).to.equal(rootElement.businessObject);

          // check parent di containment
          expect(rootElement.businessObject.diagramElements).to.contain(task_PI_BO.di);
        }));

      });


      describe('set stage', function() {

        var stage_PI;

        beforeEach(inject(function(elementRegistry, modeling) {
          stage_PI = elementRegistry.get('PI_Stage_1');

          modeling.createShape(task_PI, { x: 150, y: 405 }, stage_PI);
        }));

        it('should execute', function() {

          var stage_PI_BO = stage_PI.businessObject,
              task_PI_BO = task_PI.businessObject;

          // then
          // check parent PI
          expect(task_PI.parent).to.equal(stage_PI);

          // check semantic parent
          expect(task_PI_BO.$parent).to.exist;
          expect(task_PI_BO.$parent).to.equal(stage_PI_BO.definitionRef);

          // check parent containment
          expect(stage_PI_BO.definitionRef.get('planItems')).to.include(task_PI_BO);
          expect(stage_PI_BO.definitionRef.get('planItemDefinitions')).to.include(task_PI_BO.definitionRef);

          // check parent di
          expect(task_PI_BO.di.$parent).to.equal(rootElement.businessObject);

          // check parent di containment
          expect(rootElement.businessObject.diagramElements).to.contain(task_PI_BO.di);

        });


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          var stage_PI_BO = stage_PI.businessObject,
              task_PI_BO = task_PI.businessObject;

          // then
          // check parent PI
          expect(task_PI.parent).to.be.null;

          // check semantic parent
          expect(task_PI_BO.$parent).to.be.null;

          // check parent containment
          expect(stage_PI_BO.definitionRef.get('planItems')).not.to.include(task_PI_BO);
          expect(stage_PI_BO.definitionRef.get('planItemDefinitions')).not.to.include(task_PI_BO.definitionRef);

          // check parent di
          expect(task_PI_BO.di.$parent).to.be.null;

          // check parent di containment
          expect(rootElement.businessObject.diagramElements).not.to.contain(task_PI_BO.di);

        }));


        it('should redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          var stage_PI_BO = stage_PI.businessObject,
              task_PI_BO = task_PI.businessObject;

          // then
          // check parent PI
          expect(task_PI.parent).to.equal(stage_PI);

          // check semantic parent
          expect(task_PI_BO.$parent).to.exist;
          expect(task_PI_BO.$parent).to.equal(stage_PI_BO.definitionRef);

          // check parent containment
          expect(stage_PI_BO.definitionRef.get('planItems')).to.include(task_PI_BO);
          expect(stage_PI_BO.definitionRef.get('planItemDefinitions')).to.include(task_PI_BO.definitionRef);

          // check parent di
          expect(task_PI_BO.di.$parent).to.equal(rootElement.businessObject);

          // check parent di containment
          expect(rootElement.businessObject.diagramElements).to.contain(task_PI_BO.di);

        }));

      });


      it('should set stage 1', inject(function(modeling, elementRegistry) {

        // given
        var stage_1_PI = elementRegistry.get('PI_Stage_1');

        // when
        modeling.createShape(task_PI, { x: 150, y: 405 }, stage_1_PI);

        var stage_1_PI_BO = stage_1_PI.businessObject,
            task_PI_BO = task_PI.businessObject;

        // then
        // check parent PI
        expect(task_PI.parent).to.equal(stage_1_PI);

        // check semantic parent
        expect(task_PI_BO.$parent).to.exist;
        expect(task_PI_BO.$parent).to.equal(stage_1_PI_BO.definitionRef);

        // check parent containment
        expect(stage_1_PI_BO.definitionRef.get('planItems')).to.include(task_PI_BO);
        expect(stage_1_PI_BO.definitionRef.get('planItemDefinitions')).to.include(task_PI_BO.definitionRef);

        // check parent di
        expect(task_PI_BO.di.$parent).to.equal(rootElement.businessObject);

        // check parent di containment
        expect(rootElement.businessObject.diagramElements).to.contain(task_PI_BO.di);
      }));


      it('should set stage 2', inject(function(modeling, elementRegistry) {

        var stage_2_PI = elementRegistry.get('PI_Stage_2');

        modeling.createShape(task_PI, { x: 150, y: 313 }, stage_2_PI);

        var stage_2_PI_BO = stage_2_PI.businessObject,
            task_PI_BO = task_PI.businessObject;

        // then
        // check parent PI
        expect(task_PI.parent).to.equal(stage_2_PI);

        // check semantic parent
        expect(task_PI_BO.$parent).to.exist;
        expect(task_PI_BO.$parent).to.equal(stage_2_PI_BO.definitionRef);

        // check parent containment
        expect(stage_2_PI_BO.definitionRef.get('planItems')).to.include(task_PI_BO);
        expect(stage_2_PI_BO.definitionRef.get('planItemDefinitions')).to.include(task_PI_BO.definitionRef);

        // check parent di
        expect(task_PI_BO.di.$parent).to.equal(rootElement.businessObject);

        // check parent di containment
        expect(rootElement.businessObject.diagramElements).to.contain(task_PI_BO.di);

      }));


      it('should set stage 3', inject(function(modeling, elementRegistry) {

        var stage_3_PI = elementRegistry.get('PI_Stage_3');

        modeling.createShape(task_PI, { x: 150, y: 200 }, stage_3_PI);

        var stage_3_PI_BO = stage_3_PI.businessObject,
            task_PI_BO = task_PI.businessObject;

        // then
        // check parent PI
        expect(task_PI.parent).to.equal(stage_3_PI);

        // check semantic parent
        expect(task_PI_BO.$parent).to.exist;
        expect(task_PI_BO.$parent).to.equal(stage_3_PI_BO.definitionRef);

        // check parent containment
        expect(stage_3_PI_BO.definitionRef.get('planItems')).to.include(task_PI_BO);
        expect(stage_3_PI_BO.definitionRef.get('planItemDefinitions')).to.include(task_PI_BO.definitionRef);

        // check parent di
        expect(task_PI_BO.di.$parent).to.equal(rootElement.businessObject);

        // check parent di containment
        expect(rootElement.businessObject.diagramElements).to.contain(task_PI_BO.di);

      }));

    });


    describe('for expanded stage', function() {

      var stage_PI;

      beforeEach(inject(function(elementFactory) {
        stage_PI = elementFactory.createPlanItemShape('cmmn:Stage');
      }));


      describe('set casePlan', function() {

        var casePlan;

        beforeEach(inject(function(modeling, elementRegistry) {
          casePlan = elementRegistry.get('CasePlan_1');

          modeling.createShape(stage_PI, { x: 150, y: 490 }, casePlan);
        }));

        it('should execute', function() {

          var casePlan_BO = casePlan.businessObject,
              stage_PI_BO = stage_PI.businessObject;

          // then
          // check parent PI
          expect(stage_PI.parent).to.equal(casePlan);

          // check semantic parent
          expect(stage_PI_BO.$parent).to.exist;
          expect(stage_PI_BO.$parent).to.equal(casePlan_BO);

          // check parent containment
          expect(casePlan_BO.get('planItems')).to.include(stage_PI_BO);
          expect(casePlan_BO.get('planItemDefinitions')).to.include(stage_PI_BO.definitionRef);

          // check parent di
          expect(stage_PI_BO.di.$parent).to.equal(rootElement.businessObject);

          // check parent di containment
          expect(rootElement.businessObject.diagramElements).to.contain(stage_PI_BO.di);
        });


        it('should undo', inject(function(commandStack) {

          commandStack.undo();

          var casePlan_BO = casePlan.businessObject,
              stage_PI_BO = stage_PI.businessObject;

          // then
          // check parent PI
          expect(stage_PI.parent).to.be.null;

          // check semantic parent
          expect(stage_PI_BO.$parent).to.be.null;

          // check parent containment
          expect(casePlan_BO.get('planItems')).not.to.include(stage_PI_BO);
          expect(casePlan_BO.get('planItemDefinitions')).not.to.include(stage_PI_BO.definitionRef);

          // check parent di
          expect(stage_PI_BO.di.$parent).to.be.null;

          // check parent di containment
          expect(rootElement.businessObject.diagramElements).not.to.contain(stage_PI_BO.di);
        }));


        it('should redo', inject(function(commandStack) {

          commandStack.undo();
          commandStack.redo();

          var casePlan_BO = casePlan.businessObject,
              stage_PI_BO = stage_PI.businessObject;

          // then
          // check parent PI
          expect(stage_PI.parent).to.equal(casePlan);

          // check semantic parent
          expect(stage_PI_BO.$parent).to.exist;
          expect(stage_PI_BO.$parent).to.equal(casePlan_BO);

          // check parent containment
          expect(casePlan_BO.get('planItems')).to.include(stage_PI_BO);
          expect(casePlan_BO.get('planItemDefinitions')).to.include(stage_PI_BO.definitionRef);

          // check parent di
          expect(stage_PI_BO.di.$parent).to.equal(rootElement.businessObject);

          // check parent di containment
          expect(rootElement.businessObject.diagramElements).to.contain(stage_PI_BO.di);
        }));

      });


      describe('set stage', function() {

        var stage_1_PI;

        beforeEach(inject(function(modeling, elementRegistry) {
          stage_1_PI = elementRegistry.get('PI_Stage_1');

          modeling.createShape(stage_PI, { x: 150, y: 405 }, stage_1_PI);
        }));

        it('should execute', function() {


          var stage_1_PI_BO = stage_1_PI.businessObject,
              stage_PI_BO = stage_PI.businessObject;

          // then
          // check parent PI
          expect(stage_PI.parent).to.equal(stage_1_PI);

          // check semantic parent
          expect(stage_PI_BO.$parent).to.exist;
          expect(stage_PI_BO.$parent).to.equal(stage_1_PI_BO.definitionRef);

          // check parent containment
          expect(stage_1_PI_BO.definitionRef.get('planItems')).to.include(stage_PI_BO);
          expect(stage_1_PI_BO.definitionRef.get('planItemDefinitions')).to.include(stage_PI_BO.definitionRef);

          // check parent di
          expect(stage_PI_BO.di.$parent).to.equal(rootElement.businessObject);

          // check parent di containment
          expect(rootElement.businessObject.diagramElements).to.contain(stage_PI_BO.di);
        });


        it('should undo', inject(function(commandStack) {

          commandStack.undo();

          var stage_1_PI_BO = stage_1_PI.businessObject,
              stage_PI_BO = stage_PI.businessObject;

          // then
          // check parent PI
          expect(stage_PI.parent).to.be.null;

          // check semantic parent
          expect(stage_PI_BO.$parent).to.be.null;

          // check parent containment
          expect(stage_1_PI_BO.definitionRef.get('planItems')).not.to.include(stage_PI_BO);
          expect(stage_1_PI_BO.definitionRef.get('planItemDefinitions')).not.to.include(stage_PI_BO.definitionRef);

          // check parent di
          expect(stage_PI_BO.di.$parent).to.be.null;

          // check parent di containment
          expect(rootElement.businessObject.diagramElements).not.to.contain(stage_PI_BO.di);
        }));


        it('should redo', inject(function(commandStack) {

          commandStack.undo();
          commandStack.redo();

          var stage_1_PI_BO = stage_1_PI.businessObject,
              stage_PI_BO = stage_PI.businessObject;

          // then
          // check parent PI
          expect(stage_PI.parent).to.equal(stage_1_PI);

          // check semantic parent
          expect(stage_PI_BO.$parent).to.exist;
          expect(stage_PI_BO.$parent).to.equal(stage_1_PI_BO.definitionRef);

          // check parent containment
          expect(stage_1_PI_BO.definitionRef.get('planItems')).to.include(stage_PI_BO);
          expect(stage_1_PI_BO.definitionRef.get('planItemDefinitions')).to.include(stage_PI_BO.definitionRef);

          // check parent di
          expect(stage_PI_BO.di.$parent).to.equal(rootElement.businessObject);

        }));

      });

    });

    describe('for case plan model', function() {

      var casePlanModelShape, _case, defintions, rootElement;

      beforeEach(inject(function(elementFactory) {
        casePlanModelShape = elementFactory.createCasePlanModelShape();
        _case = casePlanModelShape.businessObject.$parent;
      }));

      beforeEach(inject(function(elementRegistry) {
        var casePlan = elementRegistry.get('CasePlan_1');
        defintions = casePlan.businessObject.$parent.$parent;
      }));

      beforeEach(inject(function(canvas){
        rootElement = canvas.getRootElement();
      }));

      describe('set defintions', function() {

        beforeEach(inject(function(elementRegistry, modeling) {
          modeling.createShape(casePlanModelShape, { x: 875, y: 150 }, rootElement);
        }));

        it('should execute', function() {

          var casePlanModelShape_BO = casePlanModelShape.businessObject;

          // then
          // check parent PI
          expect(casePlanModelShape.parent).to.equal(rootElement);

          // check semantic parent of case element
          expect(_case.$parent).to.exist;
          expect(_case.$parent).to.equal(defintions);

          // check parent containment of case element
          expect(defintions.get('cases')).to.include(_case);

          // check parent di
          expect(casePlanModelShape_BO.di.$parent).to.equal(rootElement.businessObject);

          // check parent di containment
          expect(rootElement.businessObject.diagramElements).to.contain(casePlanModelShape_BO.di);
        });


        it('should undo', inject(function(commandStack) {

          commandStack.undo();

          var casePlanModelShape_BO = casePlanModelShape.businessObject;

          // then
          // check parent PI
          expect(casePlanModelShape.parent).to.be.null;

          // check semantic parent
          expect(_case.$parent).to.be.null;

          // check parent containment
          expect(defintions.get('cases')).not.to.include(_case);

          // check parent di
          expect(casePlanModelShape_BO.di.$parent).to.be.null;

          // check parent di containment
          expect(rootElement.businessObject.diagramElements).not.to.contain(casePlanModelShape_BO.di);
        }));


        it('should redo', inject(function(commandStack) {

          commandStack.undo();
          commandStack.redo();

          var casePlanModelShape_BO = casePlanModelShape.businessObject;

          // then
          // check parent PI
          expect(casePlanModelShape.parent).to.equal(rootElement);

          // check semantic parent of case element
          expect(_case.$parent).to.exist;
          expect(_case.$parent).to.equal(defintions);

          // check parent containment
          expect(defintions.get('cases')).to.include(_case);

          // check parent di
          expect(casePlanModelShape_BO.di.$parent).to.equal(rootElement.businessObject);

          // check parent di containment
          expect(rootElement.businessObject.diagramElements).to.contain(casePlanModelShape_BO.di);
        }));

      });

    })


    describe('for milestone', function() {

      var milestone_PI;

      beforeEach(inject(function(elementFactory) {
        milestone_PI = elementFactory.createPlanItemShape('cmmn:Milestone');
      }));

      describe('set case plan', function() {

        var casePlan;

        beforeEach(inject(function(elementRegistry, modeling) {
          casePlan = elementRegistry.get('CasePlan_1');

          modeling.createShape(milestone_PI, { x: 150, y: 490 }, casePlan);
        }));

        it('should execute', function() {

          var casePlan_BO = casePlan.businessObject,
              milestone_PI_BO = milestone_PI.businessObject;

          // then
          // check parent PI
          expect(milestone_PI.parent).to.equal(casePlan);

          // check semantic parent
          expect(milestone_PI_BO.$parent).to.exist;
          expect(milestone_PI_BO.$parent).to.equal(casePlan_BO);

          // check parent containment
          expect(casePlan_BO.get('planItems')).to.include(milestone_PI_BO);
          expect(casePlan_BO.get('planItemDefinitions')).to.include(milestone_PI_BO.definitionRef);
        });


        it('should undo', inject(function(commandStack) {

          commandStack.undo();

          var casePlan_BO = casePlan.businessObject,
              milestone_PI_BO = milestone_PI.businessObject;

          // then
          // check parent PI
          expect(milestone_PI.parent).to.be.null;

          // check semantic parent
          expect(milestone_PI_BO.$parent).to.be.null;

          // check parent containment
          expect(casePlan_BO.get('planItems')).not.to.include(milestone_PI_BO);
          expect(casePlan_BO.get('planItemDefinitions')).not.to.include(milestone_PI_BO.definitionRef);
        }));


        it('should redo', inject(function(commandStack) {

          commandStack.undo();
          commandStack.redo();

          var casePlan_BO = casePlan.businessObject,
              milestone_PI_BO = milestone_PI.businessObject;

          // then
          // check parent PI
          expect(milestone_PI.parent).to.equal(casePlan);

          // check semantic parent
          expect(milestone_PI_BO.$parent).to.exist;
          expect(milestone_PI_BO.$parent).to.equal(casePlan_BO);

          // check parent containment
          expect(casePlan_BO.get('planItems')).to.include(milestone_PI_BO);
          expect(casePlan_BO.get('planItemDefinitions')).to.include(milestone_PI_BO.definitionRef);
        }));

      });


      describe('set stage', function() {

        var stage_PI;

        beforeEach(inject(function(elementRegistry, modeling) {
          stage_PI = elementRegistry.get('PI_Stage_1');

          modeling.createShape(milestone_PI, { x: 150, y: 405 }, stage_PI);
        }));

        it('should execute', function() {

          var stage_PI_BO = stage_PI.businessObject,
              milestone_PI_BO = milestone_PI.businessObject;

          // then
          // check parent PI
          expect(milestone_PI.parent).to.equal(stage_PI);

          // check semantic parent
          expect(milestone_PI_BO.$parent).to.exist;
          expect(milestone_PI_BO.$parent).to.equal(stage_PI_BO.definitionRef);

          // check parent containment
          expect(stage_PI_BO.definitionRef.get('planItems')).to.include(milestone_PI_BO);
          expect(stage_PI_BO.definitionRef.get('planItemDefinitions')).to.include(milestone_PI_BO.definitionRef);

        });


        it('should undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          var stage_PI_BO = stage_PI.businessObject,
              milestone_PI_BO = milestone_PI.businessObject;

          // then
          // check parent PI
          expect(milestone_PI.parent).to.be.null;

          // check semantic parent
          expect(milestone_PI_BO.$parent).to.be.null;

          // check parent containment
          expect(stage_PI_BO.definitionRef.get('planItems')).not.to.include(milestone_PI_BO);
          expect(stage_PI_BO.definitionRef.get('planItemDefinitions')).not.to.include(milestone_PI_BO.definitionRef);

        }));


        it('should redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          var stage_PI_BO = stage_PI.businessObject,
              milestone_PI_BO = milestone_PI.businessObject;

          // then
          // check parent PI
          expect(milestone_PI.parent).to.equal(stage_PI);

          // check semantic parent
          expect(milestone_PI_BO.$parent).to.exist;
          expect(milestone_PI_BO.$parent).to.equal(stage_PI_BO.definitionRef);

          // check parent containment
          expect(stage_PI_BO.definitionRef.get('planItems')).to.include(milestone_PI_BO);
          expect(stage_PI_BO.definitionRef.get('planItemDefinitions')).to.include(milestone_PI_BO.definitionRef);

        }));

      });


      it('should set stage 1', inject(function(modeling, elementRegistry) {

        // given
        var stage_1_PI = elementRegistry.get('PI_Stage_1');

        // when
        modeling.createShape(milestone_PI, { x: 150, y: 405 }, stage_1_PI);

        var stage_1_PI_BO = stage_1_PI.businessObject,
            milestone_PI_BO = milestone_PI.businessObject;

        // then
        // check parent PI
        expect(milestone_PI.parent).to.equal(stage_1_PI);

        // check semantic parent
        expect(milestone_PI_BO.$parent).to.exist;
        expect(milestone_PI_BO.$parent).to.equal(stage_1_PI_BO.definitionRef);

        // check parent containment
        expect(stage_1_PI_BO.definitionRef.get('planItems')).to.include(milestone_PI_BO);
        expect(stage_1_PI_BO.definitionRef.get('planItemDefinitions')).to.include(milestone_PI_BO.definitionRef);

      }));


      it('should set stage 2', inject(function(modeling, elementRegistry) {

        var stage_2_PI = elementRegistry.get('PI_Stage_2');

        modeling.createShape(milestone_PI, { x: 150, y: 313 }, stage_2_PI);

        var stage_2_PI_BO = stage_2_PI.businessObject,
            milestone_PI_BO = milestone_PI.businessObject;

        // then
        // check parent PI
        expect(milestone_PI.parent).to.equal(stage_2_PI);

        // check semantic parent
        expect(milestone_PI_BO.$parent).to.exist;
        expect(milestone_PI_BO.$parent).to.equal(stage_2_PI_BO.definitionRef);

        // check parent containment
        expect(stage_2_PI_BO.definitionRef.get('planItems')).to.include(milestone_PI_BO);
        expect(stage_2_PI_BO.definitionRef.get('planItemDefinitions')).to.include(milestone_PI_BO.definitionRef);

      }));


      it('should set stage 3', inject(function(modeling, elementRegistry) {

        var stage_3_PI = elementRegistry.get('PI_Stage_3');

        modeling.createShape(milestone_PI, { x: 150, y: 200 }, stage_3_PI);

        var stage_3_PI_BO = stage_3_PI.businessObject,
            milestone_PI_BO = milestone_PI.businessObject;

        // then
        // check parent PI
        expect(milestone_PI.parent).to.equal(stage_3_PI);

        // check semantic parent
        expect(milestone_PI_BO.$parent).to.exist;
        expect(milestone_PI_BO.$parent).to.equal(stage_3_PI_BO.definitionRef);

        // check parent containment
        expect(stage_3_PI_BO.definitionRef.get('planItems')).to.include(milestone_PI_BO);
        expect(stage_3_PI_BO.definitionRef.get('planItemDefinitions')).to.include(milestone_PI_BO.definitionRef);

      }));

    });

  });

});