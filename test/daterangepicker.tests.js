define(['lib/daterangepicker/daterangepicker'],
    function(daterangepicker){
    'use strict';

    var DateRangePicker = daterangepicker.DateRangePicker;

    describe('daterangepicker', function(){
        var picker;

        afterEach(function(){
            if(picker){
                picker.destroy();
                picker = undefined;
            }
        });

        describe('a datepicker calendar', function(){
            var calendar;

            beforeEach(function(){
                picker = daterangepicker.create();
                calendar = picker._createCalendar({
                    selectedDate: '2012-12-25',
                    className: 'myCalendar'
                });
            });

            it('calculates the start date as the first monday', function(){
                var startDate = calendar._getStartDate();

                expect(startDate.year()).toEqual(2012);
                expect(startDate.month()).toEqual(10);
                expect(startDate.date()).toEqual(26);
                expect(startDate.day()).toEqual(1);
            });

            describe('initialization', function(){
                it('stores the selected date', function(){
                    expect(calendar.selectedDate.toString()).toEqual(moment([2012,11,25]).toString());
                });

                it('stores the selected month', function(){
                    expect(calendar.monthToDisplay).toEqual(moment([2012,11,1]));
                });

                it('sets this.$el to be an empty div', function(){
                    expect(calendar.$el).toBeDefined();
                    expect(calendar.$el.is('div')).toEqual(true);
                    expect(calendar.$el.children().length).toEqual(0);
                });

                it('sets the className of this.$el', function(){
                    expect(calendar.$el.hasClass('myCalendar')).toEqual(true);
                });
            });

            describe('rendering', function(){
                beforeEach(function(){
                    calendar.render();
                });

                it('renders the table with 6 "week" rows', function(){
                    expect(calendar.$el.find('tr.week').length).toEqual(6);
                });

                it('renders the table with 42 "day" cells', function(){
                    expect(calendar.$el.find('td.day').length).toEqual(42);
                });

                it('adds the date to the day cells as "data-date"', function(){
                    expect(calendar.$el.find('td.day').first().data('date')).toEqual('2012-11-26');
                });

                it('adds a class of "grey" to the days not in the current month', function(){
                    expect(calendar.$el.find('td.day.grey').length).toEqual(11);
                });

                it('adds a class of "selected" to the selected date', function(){
                    expect(calendar.$el.find('td.day.selected').length).toEqual(1);
                    expect(calendar.$el.find('td.day.selected').data('date')).toEqual('2012-12-25');
                });

                it('renders the month title', function(){
                    expect(calendar.$el.find('th.month-title').text()).toEqual('December 2012');
                });
            });

            describe('events', function(){
                beforeEach(function(){
                    calendar.render();
                });

                it('triggers an onDateSelected event with the date clicked when a day is clicked', function(done){
                    calendar.bind('onDateSelected', function(args){
                        expect(args).toBeDefined();
                        expect(args.date).toEqual('2012-12-25');

                        done();
                    });

                    calendar.$el.find('td.day.selected').click();
                });

                it('updates the month if the date clicked is not on this.monthToDisplay', function(){
                    var previousMonthDate = calendar.$el.find('.day[data-date="2012-11-30"]'),
                        showMonthSpy = sinon.spy(calendar, 'showMonth');

                    previousMonthDate.click();

                    expect(showMonthSpy.calledOnce).toEqual(true);
                    expect(showMonthSpy.args[0][0]).toEqual(2012);
                    expect(showMonthSpy.args[0][1]).toEqual(10);
                });

                it('updates this.selectedDate when a day is clicked', function(){
                    var newDate = calendar.$el.find('.day[data-date="2012-12-01"]');

                    newDate.click();

                    expect(calendar.selectedDate.year()).toEqual(2012);
                    expect(calendar.selectedDate.month()).toEqual(11);
                    expect(calendar.selectedDate.date()).toEqual(1);
                });

                it('updates this.monthToDisplay when next is clicked', function(){
                    calendar.$el.find('.next').click();

                    expect(calendar.monthToDisplay.month()).toEqual(0);
                    expect(calendar.monthToDisplay.year()).toEqual(2013);
                });

                it('re-renders when next is clicked', function(){
                    var renderStub = sinon.stub(calendar, 'render');

                    calendar.$el.find('.next').click();

                    expect(renderStub.calledOnce).toEqual(true);
                });

                it('updates this.monthToDisplay when previous is clicked', function(){
                    calendar.$el.find('.prev').click();

                    expect(calendar.monthToDisplay.month()).toEqual(10);
                    expect(calendar.monthToDisplay.year()).toEqual(2012);
                });

                it('re-renders when previous is clicked', function(){
                    var renderStub = sinon.stub(calendar, 'render');

                    calendar.$el.find('.prev').click();

                    expect(renderStub.calledOnce).toEqual(true);
                });
            });

            describe('showing a month', function(){
                beforeEach(function(){
                    calendar.render();
                });

                it('updates this.monthToDisplay', function(){
                    calendar.showMonth(2010,0);

                    expect(calendar.monthToDisplay).toEqual(moment([2010,0]));
                });

                it('re-renders', function(){
                    var renderSpy = sinon.spy(calendar, 'render');

                    calendar.showMonth(2010,0);

                    expect(renderSpy.calledOnce).toEqual(true);
                });
            });

            describe('highlighting cells', function(){
                beforeEach(function(){
                    calendar.render();
                });

                it('highlights from the start to the end of the month if the end date is next month', function(){
                    var startDate = moment([2012,11,30]),
                        endDate = moment([2013,0,2]);

                    calendar.highlightCells(startDate, endDate);

                    expect(calendar.$el.find('.inRange').length).toEqual(1);
                    expect(calendar.$el.find('.inRange').eq(0).data('date')).toEqual('2012-12-31');
                });

                it('highlights from the end date to the start of the month if the start date is previous month', function(){
                    var startDate = moment([2012,10,30]),
                        endDate = moment([2012,11,2]);

                    calendar.highlightCells(startDate, endDate);

                    expect(calendar.$el.find('.inRange').length).toEqual(1);
                    expect(calendar.$el.find('.inRange').eq(0).data('date')).toEqual('2012-12-01');
                });

                it('highlights the range if both start and end are in the displayed month', function(){
                    var startDate = moment([2012,11,24]),
                        endDate = moment([2012,11,30]);

                    calendar.highlightCells(startDate, endDate);

                    expect(calendar.$el.find('.inRange').length).toEqual(7);
                    expect(calendar.$el.find('.inRange').eq(0).data('date')).toEqual('2012-12-24');
                    expect(calendar.$el.find('.inRange').eq(1).data('date')).toEqual('2012-12-25');
                    expect(calendar.$el.find('.inRange').eq(2).data('date')).toEqual('2012-12-26');
                    expect(calendar.$el.find('.inRange').eq(3).data('date')).toEqual('2012-12-27');
                    expect(calendar.$el.find('.inRange').eq(4).data('date')).toEqual('2012-12-28');
                    expect(calendar.$el.find('.inRange').eq(5).data('date')).toEqual('2012-12-29');
                    expect(calendar.$el.find('.inRange').eq(6).data('date')).toEqual('2012-12-30');
                });
            });
        });

        describe('a DateRangePicker', function(){

            describe('initialization', function(){

                describe('defaults', function(){
                    beforeEach(function(){
                        picker = daterangepicker.create();
                    });

                    it('creates a calendar for the current month as this.startCalendar', function(){
                        var now = moment();

                        expect(picker.startCalendar).toBeDefined();
                        expect(picker.startCalendar.monthToDisplay.month()).toEqual(now.month());
                    });

                    it('creates a calendar for the current month as this.endCalendar', function(){
                        var now = moment();

                        expect(picker.endCalendar).toBeDefined();
                        expect(picker.endCalendar.monthToDisplay.month()).toEqual(now.month());
                    });

                    it('uses the current date as the startCalendar\'s selectedDate', function(){
                        var now = moment();

                        expect(picker.startCalendar.selectedDate.year()).toEqual(now.year());
                        expect(picker.startCalendar.selectedDate.month()).toEqual(now.month());
                        expect(picker.startCalendar.selectedDate.date()).toEqual(now.date());
                    });

                    it('uses the current date as the endCalendar\'s selectedDate', function(){
                        var now = moment();

                        expect(picker.endCalendar.selectedDate.year()).toEqual(now.year());
                        expect(picker.endCalendar.selectedDate.month()).toEqual(now.month());
                        expect(picker.endCalendar.selectedDate.date()).toEqual(now.date());
                    });
                });

                describe('custom range supplied in options', function(){
                    beforeEach(function(){
                        picker = daterangepicker.create({
                            startDate: '2013-01-01',
                            endDate: '2013-02-14'
                        });
                    });

                    it('creates a calendar for the specified month as this.startCalendar', function(){
                        expect(picker.startCalendar).toBeDefined();
                        expect(picker.startCalendar.monthToDisplay.month()).toEqual(0);
                    });

                    it('creates a calendar for the specified month as this.endCalendar', function(){
                        expect(picker.endCalendar).toBeDefined();
                        expect(picker.endCalendar.monthToDisplay.month()).toEqual(1);
                    });

                    it('uses the specified date as the startCalendar\'s selectedDate', function(){
                        expect(picker.startCalendar.selectedDate.year()).toEqual(2013);
                        expect(picker.startCalendar.selectedDate.month()).toEqual(0);
                        expect(picker.startCalendar.selectedDate.date()).toEqual(1);
                    });

                    it('uses the specified date as the endCalendar\'s selectedDate', function(){
                        expect(picker.endCalendar.selectedDate.year()).toEqual(2013);
                        expect(picker.endCalendar.selectedDate.month()).toEqual(1);
                        expect(picker.endCalendar.selectedDate.date()).toEqual(14);
                    });
                });

                describe('date range presets supplied in options', function(){
                    it('stores the presets hash as this.presets', function(){
                        var presets = {
                            foo: {
                                startDate: '2013-01-01',
                                endDate: '2013-01-31'
                            },
                            bar: {
                                startDate: '2014-01-01',
                                endDate: '2014-01-31'
                            }
                        };

                        picker = daterangepicker.create({
                            presets: presets
                        });

                        expect(picker.presets).toEqual(presets);
                    });
                });
            });

            describe('rendering', function(){
                var startCalendarRenderSpy,
                    endCalendarRenderSpy;

                beforeEach(function(){
                    picker = daterangepicker.create();

                    startCalendarRenderSpy = sinon.spy(picker.startCalendar, 'render');
                    endCalendarRenderSpy = sinon.spy(picker.endCalendar, 'render');

                    picker.render();
                });

                afterEach(function(){
                    startCalendarRenderSpy = undefined;
                    endCalendarRenderSpy = undefined;
                });

                it('renders the startCalendar into this.$el', function(){
                    expect(startCalendarRenderSpy.calledOnce).toEqual(true);
                    expect(picker.$el.find(picker.startCalendar.$el).length).toEqual(1);
                });

                it('renders the correct label for the startCalendar', function(){
                    expect(picker.startCalendar.$el.find('.calendar-label').length).toEqual(1);
                    expect(picker.startCalendar.$el.find('.calendar-label').text()).toEqual('From');
                });

                it('renders the endCalendar into this.$el', function(){
                    expect(endCalendarRenderSpy.calledOnce).toEqual(true);
                    expect(picker.$el.find(picker.endCalendar.$el).length).toEqual(1);
                });

                it('renders the correct label for the endCalendar', function(){
                    expect(picker.endCalendar.$el.find('.calendar-label').length).toEqual(1);
                    expect(picker.endCalendar.$el.find('.calendar-label').text()).toEqual('To');
                });
            });

            describe('events', function(){
                beforeEach(function(){
                    picker = daterangepicker.create({
                        startDate: '2012-12-25',
                        endDate: '2012-12-31'
                    });
                    picker.render();
                });

                it('changes the this.endCalendar.selectedDate if a later date is clicked on this.startCalendar', function(){
                    picker.startCalendar.updateSelectedDate('2014-01-01');

                    expect(picker.endCalendar.selectedDate.toString()).toEqual(picker.startCalendar.selectedDate.toString());
                });

                it('changes the this.startCalendar.selectedDate if an earlier date is clicked on this.endCalendar', function(){
                    picker.endCalendar.updateSelectedDate('2011-01-01');

                    expect(picker.endCalendar.selectedDate.toString()).toEqual(picker.startCalendar.selectedDate.toString());
                });

                it('calls this.highlightRange when the startCalendar raises an onDateSelected event', function(){
                    var highlightRangeSpy = sinon.spy(picker, '_highlightRange');

                    picker.startCalendar.trigger('onDateSelected', { date: '2012-12-01' });

                    expect(highlightRangeSpy.calledOnce).toEqual(true);
                    expect(highlightRangeSpy.args[0][0].toString()).toEqual(moment([2012,11,1]).toString());
                    expect(highlightRangeSpy.args[0][1].toString()).toEqual(picker.getEndDate().toString());
                });

                it('calls this.highlightRange when the endCalendar raises an onDateSelected event', function(){
                    var highlightRangeSpy = sinon.spy(picker, '_highlightRange');

                    picker.endCalendar.trigger('onDateSelected', { date: '2012-12-30' });

                    expect(highlightRangeSpy.calledOnce).toEqual(true);
                    expect(highlightRangeSpy.args[0][0].toString()).toEqual(moment([2012,11,25]).toString());
                    expect(highlightRangeSpy.args[0][1].toString()).toEqual(moment([2012,11,30]).toString());
                });

                it('triggers a startDateSelected event when the startCalendar date changes', function(){
                    var spy = sinon.spy();

                    picker.bind('startDateSelected', spy);

                    picker.startCalendar.$el.find('.day[data-date="2012-12-01"]').click();

                    expect(spy.calledOnce).toEqual(true);
                    expect(spy.args[0][0].startDate.toString()).toEqual(moment([2012,11,1]).toString());
                });

                it('triggers a endDateSelected event when the endCalendar date changes', function(){
                    var spy = sinon.spy();

                    picker.bind('endDateSelected', spy);

                    picker.endCalendar.$el.find('.day[data-date="2012-12-30"]').click();

                    expect(spy.calledOnce).toEqual(true);
                    expect(spy.args[0][0].endDate.toString()).toEqual(moment([2012,11,30]).toString());
                });
            });

            describe('highlighting cells', function(){
                var startCalendarHighlightCellsSpy,
                    endCalendarHighlightCellsSpy;

                beforeEach(function(){
                    picker = daterangepicker.create({
                        startDate: '2012-12-01',
                        endDate: '2012-12-31'
                    });
                    picker.render();

                    startCalendarHighlightCellsSpy = sinon.spy(picker.startCalendar, 'highlightCells');
                    endCalendarHighlightCellsSpy = sinon.spy(picker.endCalendar, 'highlightCells');
                });

                it('calls this.startCalendar.highlightCells with the correct dates', function(){
                    var startDate = moment([2012,11,1]),
                        endDate = moment([2012,11,31]);

                    picker._highlightRange(startDate, endDate);

                    expect(startCalendarHighlightCellsSpy.calledOnce).toEqual(true);
                    expect(startCalendarHighlightCellsSpy.args[0][0]).toEqual(startDate);
                    expect(startCalendarHighlightCellsSpy.args[0][1]).toEqual(endDate);
                });

                it('calls this.endCalendar.highlightCells with the correct dates', function(){
                    var startDate = moment([2012,11,1]),
                        endDate = moment([2012,11,31]);

                    picker._highlightRange(startDate, endDate);

                    expect(endCalendarHighlightCellsSpy.calledOnce).toEqual(true);
                    expect(endCalendarHighlightCellsSpy.args[0][0]).toEqual(startDate);
                    expect(endCalendarHighlightCellsSpy.args[0][1]).toEqual(endDate);
                });

                it('does not call either calendar\'s highlight cells method if an invalid date range is used', function(){
                    var startDate = moment([2012,11,31]),
                        endDate = moment([2012,11,1]);

                    picker._highlightRange(startDate, endDate);

                    expect(startCalendarHighlightCellsSpy.called).toEqual(false);
                    expect(endCalendarHighlightCellsSpy.called).toEqual(false);
                });

                it('adds a "start" marker to the start cell', function(){
                    var startDate = moment([2012,11,31]),
                        endDate = moment([2012,11,1]);

                    picker._highlightRange(startDate, endDate);

                    expect(picker.startCalendar.$el.find('.marker').length).toEqual(1);
                    expect(picker.startCalendar.$el.find('.selected[data-date="2012-12-01"] .marker').text()).toEqual('start');
                });

                it('adds an "end" marker to the end cell', function(){
                    var startDate = moment([2012,11,31]),
                        endDate = moment([2012,11,1]);

                    picker._highlightRange(startDate, endDate);

                    expect(picker.endCalendar.$el.find('.marker').length).toEqual(1);
                    expect(picker.endCalendar.$el.find('.selected[data-date="2012-12-31"] .marker').text()).toEqual('end');
                });
            });

            describe('presets', function(){
                beforeEach(function(){
                    var christmas2012Str = moment([2012,11,25]).format('YYYY-MM-DD'),
                        nye2012Str = moment([2012,11,31]).format('YYYY-MM-DD');

                    picker = daterangepicker.create({
                        presets: {
                            'christmas 2012': {
                                startDate: christmas2012Str,
                                endDate: christmas2012Str
                            },
                            'new years eve 2012': {
                                startDate: nye2012Str,
                                endDate: nye2012Str
                            }
                        }
                    });

                    picker.render();
                });

                it('renders the presets list', function(){
                    expect(picker.$el.find('.presets').length).toEqual(1);

                    expect(picker.$el.find('.presets li').eq(0).text()).toEqual('christmas 2012');
                    expect(picker.$el.find('.presets li').eq(0).data('startdate')).toEqual('2012-12-25');
                    expect(picker.$el.find('.presets li').eq(0).data('enddate')).toEqual('2012-12-25');

                    expect(picker.$el.find('.presets li').eq(1).text()).toEqual('new years eve 2012');
                    expect(picker.$el.find('.presets li').eq(1).data('startdate')).toEqual('2012-12-31');
                    expect(picker.$el.find('.presets li').eq(1).data('enddate')).toEqual('2012-12-31');
                });

                it('selects the corresponding date range when a preset is clicked', function(){
                    var christmas2012 = moment([2012,11,25]);

                    picker.$el.find('.presets li').eq(0).click();

                    expect(picker.getStartDate().toString()).toEqual(christmas2012.toString());
                    expect(picker.getEndDate().toString()).toEqual(christmas2012.toString());
                });

                it('triggers a rangeSelected event when a preset is chosen', function(){
                    var spy = sinon.spy(),
                        christmas2012 = moment([2012,11,25]);

                    picker.bind('rangeSelected', spy);

                    picker.$el.find('.presets li').eq(0).click();

                    expect(spy.calledOnce).toEqual(true);
                    expect(spy.args[0][0].startDate.toString()).toEqual(christmas2012.toString());
                    expect(spy.args[0][0].endDate.toString()).toEqual(christmas2012.toString());
                });
            });
        });

        describe('as a jquery plugin', function(){
            var input,
                christmas2012Str = moment([2012,11,25]).format('YYYY-MM-DD'),
                nye2012Str = moment([2012,11,31]).format('YYYY-MM-DD');

            beforeEach(function(){
                input = $('<input id="pickerInput"/>');
                $('#testArea').append(input);

                input.daterangepicker({
                    startDate: '2013-01-01',
                    endDate: '2013-02-14',
                    presets: {
                        'christmas 2012': {
                            startDate: christmas2012Str,
                            endDate: christmas2012Str
                        },
                        'new years eve 2012': {
                            startDate: nye2012Str,
                            endDate: nye2012Str
                        }
                    }
                });
            });

            afterEach(function(){
                input.data('picker').destroy();
                $('#testArea').empty();
            });

            it('attaches a picker instance to the target element', function(){
                expect(input.data('picker')).toBeDefined();
            });

            it('passes supplied options through to the picker', function(){
                input.click();

                var picker = input.data('picker');

                expect(picker.startCalendar.selectedDate.toString()).toEqual(moment([2013,0,1]).toString());
                expect(picker.endCalendar.selectedDate.toString()).toEqual(moment([2013,1,14]).toString());
            });

            it('shows the picker when the target element is clicked', function(){
                var showStub = sinon.stub(daterangepicker.prototype, 'show');

                input.click();

                expect(showStub.calledOnce).toEqual(true);

                showStub.restore();
            });

            it('hides the picker when a click occurs outside the picker area', function(){
                var hideStub = sinon.stub(daterangepicker.prototype, 'hide');

                input.click();
                $('body').click();

                expect(hideStub.calledOnce).toEqual(true);

                hideStub.restore();
            });

            it('updates the target element when a start date is selected', function(){
                input.click();

                var picker = input.data('picker');

                picker.startCalendar.$el.find('[data-date="2013-01-01"]').click();

                expect(input.val()).toEqual('01 Jan 2013 - 14 Feb 2013');
            });

            it('updates the target element when an end date is selected', function(){
                input.click();

                var picker = input.data('picker');

                picker.endCalendar.$el.find('[data-date="2013-03-01"]').click();

                expect(input.val()).toEqual('01 Jan 2013 - 01 Mar 2013');
            });

            it('updates the target element when a preset date is selected', function(){
                input.click();

                var picker = input.data('picker');

                picker.$el.find('.presets li').eq(0).click();

                expect(input.val()).toEqual('25 Dec 2012 - 25 Dec 2012');
            });
        });

    });
});