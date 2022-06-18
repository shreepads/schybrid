// Copyright (c) 2022 Shreepad Shukla
// SPDX-License-Identifier: AGPL-3.0-only
use clap::Parser;
use teams_info::Teams;

// Setup the command line arguments and help using Clap

/// Schedule hybrid work teams to ensure each team gets one day together in office
#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct Args {
    /// Total number of seats
    #[clap(short, long, value_parser)]
    seats: u32,

    /// CSV filepath with team info
    #[clap(short, long, value_parser)]
    filepath: String,
}

// Worker function
fn find_optimal_seating(seats: u32, filepath: String) -> u8 {
    println!("Finding optimal seating for {} seats using teams info from {}",
        seats,
        filepath
    );

    let teams = Teams::from_csv_file(filepath);

    0
}

fn main() {
    let args = Args::parse();

    find_optimal_seating(args.seats, args.filepath);
}
