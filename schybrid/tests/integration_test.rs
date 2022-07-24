use teams_info::Teams;
use teams_sched::alloc_pref::AllocatedPreference;
use teams_sched::TeamsSchedule;

#[test]
fn schedule_tiny() {
    let result = Teams::from_csv_file(String::from("../resources/testdata/testdata-tiny.csv"));
    assert!(result.is_ok());
    let teams = result.unwrap();
    let teams_count = teams.teams_count;

    // Check for best combination with 5 seats
    let result = teams.get_best_valid_combination(5);
    assert!(result.is_some());
    let best_combination = result.unwrap();

    // Generate schedule with 5 seats
    let best_sched = TeamsSchedule::new(teams.get_clone(), best_combination, 5);
    assert_eq!(best_sched.seats, 5);

    for i in 0..teams_count {
        let team_opt = teams.get_team(i);
        assert!(team_opt.is_some());
        let team = team_opt.unwrap();

        let team_sched_opt = best_sched.get_team_schedule(i);
        assert!(team_sched_opt.is_some());
        let team_sched = team_sched_opt.unwrap();

        // Print them for comparison
        println!("Team: {:?}", team);
        println!("Schedule: {:?}", team_sched);
        println!("");

        if team_sched.allocated_day == team.first_pref {
            assert_eq!(team_sched.allocated_pref, AllocatedPreference::First);
        } else if team_sched.allocated_day == team.second_pref {
            assert_eq!(team_sched.allocated_pref, AllocatedPreference::Second);
        } else {
            assert_eq!(team_sched.allocated_pref, AllocatedPreference::Other);
        }
    }
}
