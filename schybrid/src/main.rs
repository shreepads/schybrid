// Copyright (c) 2022 Shreepad Shukla
// SPDX-License-Identifier: AGPL-3.0-only

use std::error::Error;

use clap::Parser;
use teams_info::Teams;
use teams_sched::TeamsSchedule;

// Setup the command line arguments and help using Clap

/// Schedule hybrid work teams to ensure each team gets one day together in office
#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct Args {
    /// Total number of seats
    #[clap(short, long, value_parser)]
    seats: u64,

    /// CSV filepath with team info
    #[clap(short, long, value_parser)]
    filepath: String,
}

// Worker function
fn find_optimal_seating(seats: u64, filepath: String) -> Result<u8, Box<dyn Error>> {
    println!(
        "Finding optimal seating for {} seats using teams info from {}",
        seats, filepath
    );

    let teams = Teams::from_csv_file(filepath)?;

    // Check for best combination with given seats
    if let Some(best_combination) = teams.get_best_valid_combination(seats) {
        println!("The best combination is {:?}", best_combination);

        // Get the schedule for the best combination
        let best_sched = TeamsSchedule::new(teams, best_combination, seats);

    } else {
        println!("There is no valid combination");
    }


    Ok(0)
}

fn main() {
    let args = Args::parse();

    find_optimal_seating(args.seats, args.filepath);
}
